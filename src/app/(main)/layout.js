import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/ui/Footer"
import Header from "@/components/ui/Header"
import './flechas.css'



export default function Layout({children}) {
  return (
        <Provider>
          <Header />
          <div style={{flex: 1}}>{children}</div>
          <Footer />
          <Toaster/>
        </Provider>
  )
}