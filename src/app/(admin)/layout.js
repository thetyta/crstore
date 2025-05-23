import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"
import AdminHeader from "@/components/ui/AdminHeader"
import AdminProtegida from "@/components/Admin/AdminProtegida"

export default function Layout({children}) {
  return (
    <Provider>
      <AdminProtegida>
        <AdminHeader />
        <div style={{flex: 1}}>{children}</div>
        <Toaster/>
      </AdminProtegida>
    </Provider>
  )
}