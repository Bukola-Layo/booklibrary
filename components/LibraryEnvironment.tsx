import Image from "next/image";

export default function LibraryEnvironment() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src="/booknook-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 85% at 50% 45%, transparent 55%, rgba(60,36,18,0.28) 100%)",
        }}
      />
    </div>
  );
}
