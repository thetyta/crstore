import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/ui/Footer"
import Header from "@/components/ui/Header"

export default function RootLayout({children}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <Header />
          <div style={{flex: 1}}>{children}</div>
          <Footer />
          <Toaster/>
        </Provider>
      </body>
    </html>
  )
}