import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, CheckCircle, ArrowRight } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">MediControl</h1>
          <p className="mt-1 text-muted-foreground">Sistema de Salud Ocupacional</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <CardTitle>¡Cuenta Creada Exitosamente!</CardTitle>
            <CardDescription>
              Tu cuenta ha sido registrada correctamente en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Ya puedes iniciar sesión con tus credenciales. Tu cuenta está lista para usar.
            </p>
            
            <div className="rounded-lg bg-secondary p-4 text-sm">
              <p className="font-medium text-secondary-foreground">Información importante:</p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                <li>Tu cuenta ha sido creada con el rol de <strong>viewer</strong></li>
                <li>Un administrador puede asignarte una empresa y cambiar tu rol si es necesario</li>
                <li>Ya puedes acceder al dashboard del sistema</li>
              </ul>
            </div>

            <Link href="/dashboard">
              <Button className="w-full">
                Ir al Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/auth/login">
              <Button variant="outline" className="w-full bg-transparent">
                Iniciar Sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
