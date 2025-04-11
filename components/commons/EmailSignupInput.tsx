import { cn } from "@/lib/utils"; // Assuming cn is from a utility like classnames or your own helper

type EmailSignupProps = {
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  onSubmit?: (email: string) => void;
};

const EmailSignup: React.FC<EmailSignupProps> = ({
  className,
  inputClassName,
  buttonClassName,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (onSubmit && email.value) {
      onSubmit(email.value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={cn(
          "w-[450px] border border-[#E7E5E4] max-lg:border-0 rounded-full pl-6 py-4 relative max-lg:w-full",
          className
        )}
      >
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email Address"
          className={cn(
            "text-base leading-[150%] text-gray-600 outline-none w-1/2 bg-transparent",
            inputClassName
          )}
        />
        <div className="absolute top-1/2 -translate-y-1/2 right-0">
          <button
            type="submit"
            className={cn(
              "group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-neutral-950 py-1 pl-6 pr-14 font-medium text-neutral-50",
              buttonClassName
            )}
          >
            <span className="z-10 pr-8 group-hover:text-black">Sign Up</span>
            <div className="absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-white transition-[width] group-hover:w-[calc(100%-8px)]">
              <div className="mr-3.5 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M14 8L18 12M18 12L14 16M18 12L6 12"
                    stroke="#0C0A09"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </form>
  );
};

export default EmailSignup;