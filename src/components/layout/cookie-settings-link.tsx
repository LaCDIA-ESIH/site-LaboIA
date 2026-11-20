"use client";

const consentCookie = "lacdia_cookie_consent";

export default function CookieSettingsLink({ label }: { label: string }) {
  const handleClick = () => {
    document.cookie = `${consentCookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-left text-sm text-[#f3efe4]/80 transition-colors hover:text-white"
    >
      {label}
    </button>
  );
}
