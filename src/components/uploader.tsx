import { navigate } from "astro/virtual-modules/transitions-router.js";
import { useState } from "react";

export default function Uploader() {
  const [prompt, setPrompt] = useState("");
  const [preset, setPreset] = useState("");
  const [asset, setAsset] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const [file] = Object.values(event.target.files);
    setAsset(file);

    const src = URL.createObjectURL(file);
    setPreset(src);
  };

  const sendFileToServer = async () => {
    if (!asset) return;

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: asset,
      });

      if (res.ok) {
        const data = await res.json();

        return navigate(
          `/start?id=${encodeURIComponent(data.publicId)}&prompt=${encodeURIComponent(prompt !== '' ? prompt : 'A spooky bakground with halloween tematic')}`
        );
      }

      setLoading(false);
    } catch (err) {}
  };

  const handlePrompt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };
  return (
    <div className="relative flex flex-col items-center aspect-video max-w-[600px] mx-auto w-full h-auto backdrop-blur-md">
      <span className="font-bold text-xl text-red-300 mb-2">
        {preset ? "¿Te gusta?" : "¡Selecciona una foto tuya!"}
      </span>
      <label
        htmlFor="preset"
        className="relative flex justify-center items-center w-full h-full cursor-pointer border border-red-600 shadow-inner shadow-transparent rounded-md transition hover:shadow-red-500"
        title="Selecciona una foto tuya"
      >
        <input
          type="file"
          name="preset"
          id="preset"
          onChange={handleChange}
          className="w-full"
          hidden
          accept="image/*"
        />

        <svg
          className="text-red-400 w-[50px] h-auto transition"
          style={{ opacity: preset ? "0" : "1" }}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
          <path d="M12 11l0 6" />
          <path d="M9 14l6 0" />
        </svg>

        {preset && (
          <img
            src={preset}
            alt="Excelente foto de un gran usuario."
            className="absolute aspect-video object-contain -z-10"
            loading="lazy"
          />
        )}
      </label>

      <div className="my-4">
        <span>Puedes elegir que fondo quieres aplicarle a la imagen</span>
        <input
          type="text"
          onChange={handlePrompt}
          className="max-w-[90%] mt-2 h-auto w-full mx-auto  rounded  border border-red-600/30 py-2 px-4 transition focus-visible:border-red-600 placeholder:text-white/30"
          placeholder="Quiero un fondo de halloween que de mucho miedo..."
          style={{ background: "none" }}
        />
      </div>

      <button
        onClick={sendFileToServer}
        className="py-2 px-4 rounded-md border border-red-900 shadow-inner shadow-red-400 transition hover:bg-red-500 hover:text-black font-bold"
        style={{
          opacity: loading || !asset ? ".7" : "1",
          pointerEvents: loading || !asset ? "none" : "auto",
        }}
      >
        {loading ? "Subiendo.. 🎃" : "Subir 🎃"}
      </button>
    </div>
  );
}
