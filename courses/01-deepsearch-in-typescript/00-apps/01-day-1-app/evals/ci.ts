export const ciData = [
  {
    input: `Which Arsenal player has scored the most goals in the Champions League in the 2024-2025 season?`,
    expected: `Bukayo Saka: 5 goals`,
  },
  {
    input: `In this season, are Arsenal better in the first half of games, or the second half of games?`,
    expected: `Arsenal are winning the 'first half table', a premier league table that
      only includes the first half of each game. They have a +18 goal difference at the
      start of games, and would have scored 63 points if the table did not include
      the second half of games.

      However, they are worse in the second half of games. They would have scored
      54 points in the second half of games, compared to 63 in the first half.
      Liverpool are the best team in the second half of games, with 75 points.`,
  },
  {
    input: `How do I pnpm upgrade only a certain set of dependencies - ones starting with @tanstack`,
    expected: `pnpm upgrade "@tanstack/*"`,
  },
  {
    input: "How do you do a 404 page in tanstack start?",
    expected: `
    import { createRouter, Link } from '@tanstack/react-router'

    const router = createRouter({
      defaultNotFoundComponent: () => {
        return (
          <div>
            <p>Not found!</p>
            <Link to="/">Go home</Link>
          </div>
        )
      },
    })
    `,
  },
  {
    input: "How do I export subtitles from DaVinci Resolve?",
    expected: `Exporting Subtitles as a Separate File (SRT):

Deliver Page: Go to the Deliver page in DaVinci Resolve.
Render Settings: In the "Render Settings" panel, make sure to check the "Export Subtitle" option.
Format: Choose "Subtitle Files (*.srt)" or your desired format. SRT is widely compatible.
Burn into Video: Uncheck the "Burn into video" option if you want a separate subtitle file.
Export: Add the job to the render queue and render. DaVinci Resolve will create both the video file and a separate .srt file.`,
  },
];
