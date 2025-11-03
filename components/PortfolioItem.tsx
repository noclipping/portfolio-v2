type Props = {
  name: string;
  link?: string | null;
  iconUrl?: string | null;
  blurb?: string | null;
};

export default function PortfolioItem({ name, link, iconUrl, blurb }: Props) {
  return (
    <div className="flex items-start gap-3 py-3 border-t border-[#21262d] first:border-0">
      {/* Icon - can be emoji or image URL */}
      <div className="flex-shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center">
        {iconUrl ? (
          iconUrl.startsWith("http://") ||
          iconUrl.startsWith("https://") ||
          iconUrl.startsWith("/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={iconUrl}
              alt=""
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xl leading-none">{iconUrl}</span>
          )
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Name + Link */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {link ? (
              <a
                href={link.startsWith("http") ? link : `https://${link}`}
                target="_blank"
                className="text-neutral-100 hover:underline"
              >
                {name}
              </a>
            ) : (
              <span className="text-neutral-100">{name}</span>
            )}
          </div>
          {link ? (
            <a
              href={link.startsWith("http") ? link : `https://${link}`}
              target="_blank"
              className="text-xs text-neutral-500 hover:text-neutral-400 underline"
            >
              {link}
            </a>
          ) : null}
        </div>

        {/* Blurb */}
        {blurb ? (
          <div className="text-sm text-neutral-400 pt-1 mt-1">{blurb}</div>
        ) : null}
      </div>
    </div>
  );
}
