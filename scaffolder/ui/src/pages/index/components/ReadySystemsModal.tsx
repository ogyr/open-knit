type ReadySystemsModalProps = {
    isOpen: boolean;
    email: string;
    onEmailChange: (value: string) => void;
    emailIsValid: boolean;
    isPending: boolean;
    onClose: () => void;
    onSubmit: () => void;
};

export default function ReadySystemsModal({
                                              isOpen,
                                              email,
                                              onEmailChange,
                                              emailIsValid,
                                              isPending,
                                              onClose,
                                              onSubmit
                                          }: ReadySystemsModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] px-4"
            onClick={onClose}
        >
            <div
                className="bg-[var(--white)] rounded-[16px] w-full max-w-[460px] p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-[var(--text-strong)]">
                        Ready systems in progress
                    </h3>
                    <button
                        type="button"
                        className="text-sm text-[var(--text-muted)] cursor-pointer"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                <p className="mt-3 font-normal text-[var(--text-body)]">
                    Ready systems are still in progress. If you'd like to be notified when they are ready,
                    leave your email below.
                </p>
                <p className="mt-3 font-normal text-[var(--text-body)]">
                    For the moment, we recommend checking out the ready-to-use bundles.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(event) => onEmailChange(event.target.value)}
                        className="w-full h-[42px] rounded-[10px] border border-[var(--border-strong)] px-3 outline-none focus:border-[var(--primary-hover)]"
                    />
                    <button
                        type="button"
                        className={`h-[42px] rounded-[10px] text-[var(--white)] font-medium transition-colors flex items-center justify-center ${
                            emailIsValid && !isPending
                                ? "bg-[var(--primary)] cursor-pointer hover:bg-[var(--primary-hover)]"
                                : "bg-[var(--primary-disabled)] cursor-not-allowed"
                        }`}
                        disabled={!emailIsValid || isPending}
                        onClick={onSubmit}
                    >
                        {isPending ? <span className="spinner" aria-label="Loading"/> : "Notify me"}
                    </button>
                </div>
            </div>
        </div>
    );
}
