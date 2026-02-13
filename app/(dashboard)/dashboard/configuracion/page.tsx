import { getProfile } from '@/lib/auth-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, User } from 'lucide-react'

export default async function ConfiguracionPage() {
  const profile = await getProfile()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">
          Ajustes de tu cuenta y preferencias
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Datos de la cuenta
          </CardTitle>
          <CardDescription>
            Información de tu perfil (solo lectura). Un administrador puede actualizar tu empresa y rol.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nombre</p>
            <p className="font-medium">{profile?.full_name ?? '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Correo</p>
            <p className="font-medium">{profile?.email ?? '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Rol</p>
            <p className="font-medium capitalize">{profile?.role ?? '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Empresa asignada</p>
            <p className="font-medium">{profile?.company?.name ?? 'Sin empresa asignada'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Filtro de empresa
          </CardTitle>
          <CardDescription>
            En el menú lateral puedes elegir la empresa por la que filtrar los datos (Todas, Hiltexpoy, Interfibra, etc.). Esa selección solo afecta lo que ves en el dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
