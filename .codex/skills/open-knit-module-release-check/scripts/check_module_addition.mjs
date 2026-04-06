#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = { repo: null, modules: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const currentArg = argv[index];
    if (currentArg === "--repo") {
      args.repo = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (currentArg === "--module") {
      const moduleValue = argv[index + 1] ?? null;
      if (moduleValue) {
        args.modules.push(moduleValue);
      }
      index += 1;
    }
  }

  if (!args.repo) {
    throw new Error("Missing required argument: --repo <path>");
  }

  if (args.modules.length === 0) {
    throw new Error("At least one --module public-slug:backend-module:frontend-module is required.");
  }

  return args;
}

function parseModuleSpec(rawValue) {
  const parts = rawValue.split(":").map((value) => value.trim());
  if (parts.length !== 3 || parts.some((value) => value.length === 0)) {
    throw new Error(
      `Invalid module spec '${rawValue}'. Expected public-slug:backend-module:frontend-module.`
    );
  }

  return {
    publicSlug: parts[0],
    backendModule: parts[1],
    frontendModule: parts[2] === "-" ? null : parts[2],
  };
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function directoryExists(directoryPath) {
  return fileExists(directoryPath) && fs.statSync(directoryPath).isDirectory();
}

function parseEnvAssignments(filePath) {
  if (!fileExists(filePath)) {
    return {};
  }

  const values = {};
  for (const rawLine of readText(filePath).split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    values[key] = value;
  }

  return values;
}

function parseCsv(rawValue) {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseAliases(rawValue) {
  const aliases = {};
  for (const item of parseCsv(rawValue)) {
    const separatorIndex = item.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const alias = item.slice(0, separatorIndex).trim();
    const target = item.slice(separatorIndex + 1).trim();
    aliases[alias] = target;
  }

  return aliases;
}

function walkFiles(rootPath) {
  const pendingPaths = [rootPath];
  const discoveredFiles = [];

  while (pendingPaths.length > 0) {
    const currentPath = pendingPaths.pop();
    if (!currentPath || !fileExists(currentPath)) {
      continue;
    }

    const currentStat = fs.statSync(currentPath);
    if (currentStat.isFile()) {
      discoveredFiles.push(currentPath);
      continue;
    }

    if (!currentStat.isDirectory()) {
      continue;
    }

    for (const childName of fs.readdirSync(currentPath)) {
      pendingPaths.push(path.join(currentPath, childName));
    }
  }

  return discoveredFiles;
}

function hasSourceFiles(rootPath, suffixes) {
  if (!directoryExists(rootPath)) {
    return false;
  }

  return walkFiles(rootPath).some((filePath) => suffixes.includes(path.extname(filePath)));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function containsAliasEntry(filePath, aliasName, modulePath) {
  if (!fileExists(filePath)) {
    return false;
  }

  const content = readText(filePath);
  const tsconfigPattern = new RegExp(
    String.raw`["']@${escapeRegExp(aliasName)}/\*["']\s*:\s*\[\s*["']${escapeRegExp(modulePath)}/\*["']`,
    "u"
  );
  const vitePattern = new RegExp(
    String.raw`["']@${escapeRegExp(aliasName)}["']\s*:\s*path\.resolve\(__dirname,\s*["']${escapeRegExp(modulePath)}["']\)`,
    "u"
  );

  return tsconfigPattern.test(content) || vitePattern.test(content);
}

function pushResult(results, condition, successMessage, failureMessage) {
  results.push({
    status: condition ? "PASS" : "FAIL",
    message: condition ? successMessage : failureMessage,
  });
}

function checkModule(repoRoot, moduleSpec) {
  const results = [];

  const backendModuleRoot = path.join(repoRoot, "backend", "modules", moduleSpec.backendModule);
  const backendAgentsPath = path.join(backendModuleRoot, "AGENTS.md");

  pushResult(
    results,
    directoryExists(backendModuleRoot),
    `${moduleSpec.publicSlug}: backend module directory exists at ${backendModuleRoot}`,
    `${moduleSpec.publicSlug}: missing backend module directory at ${backendModuleRoot}`
  );
  pushResult(
    results,
    fileExists(backendAgentsPath),
    `${moduleSpec.publicSlug}: backend AGENTS guide exists`,
    `${moduleSpec.publicSlug}: missing backend AGENTS guide at ${backendAgentsPath}`
  );
  pushResult(
    results,
    hasSourceFiles(backendModuleRoot, [".java", ".kt"]),
    `${moduleSpec.publicSlug}: backend module contains source files`,
    `${moduleSpec.publicSlug}: backend module has no Java/Kotlin source files`
  );

  if (moduleSpec.frontendModule) {
    const frontendModuleRoot = path.join(repoRoot, "frontend", "modules", moduleSpec.frontendModule);
    pushResult(
      results,
      directoryExists(frontendModuleRoot),
      `${moduleSpec.publicSlug}: frontend module directory exists at ${frontendModuleRoot}`,
      `${moduleSpec.publicSlug}: missing frontend module directory at ${frontendModuleRoot}`
    );
    pushResult(
      results,
      hasSourceFiles(frontendModuleRoot, [".ts", ".tsx"]),
      `${moduleSpec.publicSlug}: frontend module contains TypeScript source files`,
      `${moduleSpec.publicSlug}: frontend module has no TypeScript source files`
    );

    const scaffolderDirectory = path.join(frontendModuleRoot, "_scaffolder");
    const hasAdminConfig =
      directoryExists(scaffolderDirectory) &&
      fs
        .readdirSync(scaffolderDirectory)
        .some((fileName) => fileName.endsWith("AdminLayoutConfig.tsx"));
    pushResult(
      results,
      hasAdminConfig,
      `${moduleSpec.publicSlug}: frontend admin scaffolder config exists`,
      `${moduleSpec.publicSlug}: missing frontend _scaffolder/*AdminLayoutConfig.tsx`
    );

    const adminLayoutPath = path.join(
      repoRoot,
      "frontend",
      "src",
      "components",
      "admin",
      "AdminLayout.tsx"
    );
    const adminLayoutContent = fileExists(adminLayoutPath) ? readText(adminLayoutPath) : "";
    pushResult(
      results,
      adminLayoutContent.includes(`@${moduleSpec.frontendModule}/_scaffolder/`),
      `${moduleSpec.publicSlug}: AdminLayout references the module scaffolder config`,
      `${moduleSpec.publicSlug}: AdminLayout does not reference @${moduleSpec.frontendModule}/_scaffolder/`
    );

    const modulePath = `modules/${moduleSpec.frontendModule}`;
    pushResult(
      results,
      containsAliasEntry(path.join(repoRoot, "frontend", "vite.config.ts"), moduleSpec.frontendModule, modulePath),
      `${moduleSpec.publicSlug}: frontend Vite alias is registered`,
      `${moduleSpec.publicSlug}: missing Vite alias for @${moduleSpec.frontendModule}`
    );

    for (const tsconfigName of ["tsconfig.json", "tsconfig.app.json", "tsconfig.node.json"]) {
      pushResult(
        results,
        containsAliasEntry(path.join(repoRoot, "frontend", tsconfigName), moduleSpec.frontendModule, modulePath),
        `${moduleSpec.publicSlug}: ${tsconfigName} contains alias for @${moduleSpec.frontendModule}`,
        `${moduleSpec.publicSlug}: ${tsconfigName} is missing alias for @${moduleSpec.frontendModule}`
      );
    }
  }

  const scaffolderCatalogPath = path.join(
    repoRoot,
    "scaffolder",
    "ui",
    "src",
    "content",
    "scaffolderCatalog.ts"
  );
  const scaffolderCatalogContent = fileExists(scaffolderCatalogPath) ? readText(scaffolderCatalogPath) : "";
  pushResult(
    results,
    scaffolderCatalogContent.includes(`slug: "${moduleSpec.publicSlug}"`),
    `${moduleSpec.publicSlug}: scaffolder catalog contains module slug`,
    `${moduleSpec.publicSlug}: scaffolder catalog is missing slug '${moduleSpec.publicSlug}'`
  );
  pushResult(
    results,
    scaffolderCatalogContent.includes(`backendName: "${moduleSpec.backendModule}"`),
    `${moduleSpec.publicSlug}: scaffolder catalog maps to backend module '${moduleSpec.backendModule}'`,
    `${moduleSpec.publicSlug}: scaffolder catalog is missing backendName '${moduleSpec.backendModule}'`
  );

  const moduleDocsPath = path.join(repoRoot, "scaffolder", "ui", "src", "content", "moduleDocs.ts");
  const moduleDocsContent = fileExists(moduleDocsPath) ? readText(moduleDocsPath) : "";
  pushResult(
    results,
    moduleDocsContent.includes(`../../../../backend/modules/${moduleSpec.backendModule}/AGENTS.md?raw`),
    `${moduleSpec.publicSlug}: module docs import backend AGENTS guide`,
    `${moduleSpec.publicSlug}: module docs are missing import for backend/modules/${moduleSpec.backendModule}/AGENTS.md`
  );
  pushResult(
    results,
    new RegExp(String.raw`${escapeRegExp(moduleSpec.publicSlug)}\s*:\s*\{`, "u").test(moduleDocsContent),
    `${moduleSpec.publicSlug}: module docs registry contains the slug`,
    `${moduleSpec.publicSlug}: module docs registry is missing slug '${moduleSpec.publicSlug}'`
  );

  const sitemapPath = path.join(repoRoot, "scaffolder", "ui", "public", "sitemap.xml");
  const sitemapContent = fileExists(sitemapPath) ? readText(sitemapPath) : "";
  pushResult(
    results,
    sitemapContent.includes(`<loc>https://open-knit.com/modules/${moduleSpec.publicSlug}</loc>`),
    `${moduleSpec.publicSlug}: sitemap includes the module page`,
    `${moduleSpec.publicSlug}: sitemap is missing /modules/${moduleSpec.publicSlug}`
  );

  const dockerfileCoolifyPath = path.join(repoRoot, "scaffolder", "Dockerfile.coolify");
  const dockerfileCoolifyContent = fileExists(dockerfileCoolifyPath)
    ? readText(dockerfileCoolifyPath)
    : "";
  pushResult(
    results,
    dockerfileCoolifyContent.includes(
      `COPY backend/modules/${moduleSpec.backendModule}/AGENTS.md /app/backend/modules/${moduleSpec.backendModule}/AGENTS.md`
    ),
    `${moduleSpec.publicSlug}: Dockerfile.coolify copies backend AGENTS guide for SSR build`,
    `${moduleSpec.publicSlug}: Dockerfile.coolify is missing copy for backend/modules/${moduleSpec.backendModule}/AGENTS.md`
  );

  for (const envFileName of [".env", ".env-template"]) {
    const envPath = path.join(repoRoot, "scaffolder", envFileName);
    const envValues = parseEnvAssignments(envPath);
    const availableModules = parseCsv(envValues.AVAILABLE_MODULES);
    const aliases = parseAliases(envValues.MODULE_ALIASES);

    pushResult(
      results,
      availableModules.includes(moduleSpec.backendModule),
      `${moduleSpec.publicSlug}: ${envFileName} includes '${moduleSpec.backendModule}' in AVAILABLE_MODULES`,
      `${moduleSpec.publicSlug}: ${envFileName} is missing '${moduleSpec.backendModule}' in AVAILABLE_MODULES`
    );

    if (moduleSpec.publicSlug !== moduleSpec.backendModule) {
      pushResult(
        results,
        aliases[moduleSpec.publicSlug] === moduleSpec.backendModule,
        `${moduleSpec.publicSlug}: ${envFileName} maps alias '${moduleSpec.publicSlug}:${moduleSpec.backendModule}'`,
        `${moduleSpec.publicSlug}: ${envFileName} is missing alias '${moduleSpec.publicSlug}:${moduleSpec.backendModule}' in MODULE_ALIASES`
      );
    }
  }

  return results;
}

function main() {
  let parsedArgs;
  try {
    parsedArgs = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(String(error.message ?? error));
    process.exit(2);
  }

  const repoRoot = path.resolve(parsedArgs.repo);
  if (!directoryExists(repoRoot)) {
    console.error(`Repository root does not exist: ${repoRoot}`);
    process.exit(2);
  }

  let moduleSpecs;
  try {
    moduleSpecs = parsedArgs.modules.map(parseModuleSpec);
  } catch (error) {
    console.error(String(error.message ?? error));
    process.exit(2);
  }

  const findings = moduleSpecs.flatMap((moduleSpec) => checkModule(repoRoot, moduleSpec));
  const failedFindings = findings.filter((finding) => finding.status === "FAIL");

  for (const finding of findings) {
    console.log(`[${finding.status}] ${finding.message}`);
  }

  console.log("");
  console.log(
    "Reminder: update production env values and secrets for the new module before deploy, especially AVAILABLE_MODULES, MODULE_ALIASES, and any module-specific configuration keys."
  );

  process.exit(failedFindings.length > 0 ? 1 : 0);
}

main();
