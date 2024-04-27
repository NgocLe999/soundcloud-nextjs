import NextAuthSession from "@/components/lib/next.auth.wraper";
import ProgressBarWrapper from "@/components/lib/progress.bar";
import { TrackContextProvider } from "@/components/lib/tracks.context";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import { ToastProvider } from "@/components/ultils/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <ProgressBarWrapper>
            <NextAuthSession>
              <TrackContextProvider>
                <ToastProvider>{children}</ToastProvider>
              </TrackContextProvider>
            </NextAuthSession>
          </ProgressBarWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
//Supported Pattern: Passing Server Components to Client Components as Props
