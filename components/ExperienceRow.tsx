import Badge from "./Badge";

type Props = {
  name: string;
  role: string;
  statusTag?: string | null;
  years?: string | null;
  blurb?: string | null;
  link?: string | null;
  iconUrl?: string | null;
};

export default function ExperienceRow({
  name,
  role,
  statusTag,
  years,
  blurb,
  link,
  iconUrl,
}: Props) {
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
      <div className="flex-1 grid grid-cols-12 gap-2 items-start">
        {/* Name + Link */}
        <div className="col-span-12 sm:col-span-5 flex flex-col gap-1">
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

        {/* Role */}
        <div className="col-span-12 sm:col-span-3 text-sm text-neutral-400">
          {role}
        </div>

        {/* Status Badge */}
        <div className="col-span-12 sm:col-span-2">
          {statusTag ? <Badge text={statusTag} /> : null}
        </div>

        {/* Years */}
        <div className="col-span-12 sm:col-span-2 text-xs text-neutral-500 text-right">
          {years}
        </div>

        {/* Blurb */}
        {blurb ? (
          <div className="col-span-12 text-sm text-neutral-400 pt-1">
            {blurb}
          </div>
        ) : null}
      </div>
    </div>
  );
}
