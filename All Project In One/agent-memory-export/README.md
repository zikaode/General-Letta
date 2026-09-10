# Agent Memory Export — Tutor

Snapshot memori agent **Tutor** (`agent-dad96fa1-fcae-4162-aeee-6f75c33ed66f`),
diekspor 2026-09-10. Ini cadangan portabel dari pengalaman & pembelajaran agent —
bukan memori hidup (yang asli tetap di `~/.letta/agents/<agent-id>/memory`).

## Isi

- `system/` — memory blocks yang selalu dimuat: `human.md` (preferensi user),
  `persona.md` (identitas agent), `onboarding.md`
- `skills/explainer-video-pipeline/` — pipeline video explainer end-to-end +
  `caption-skin.html` standar (kontras universal terang/gelap)
- `reference/` — `bintang-video-project.md` (riwayat + resume procedure proyek
  video), `technical-environment.md`
- `profile.png` — gambar profil agent

## Cara mengimpor ke agent lain

1. Salin folder yang diinginkan (`system/`, `skills/`, `reference/`) ke
   `~/.letta/agents/<agent-baru>/memory/`
2. Di folder memori agent itu: `git add . && git commit -m "Import memory dari Tutor"`

Detail: lihat skill `migrating-memory`.
