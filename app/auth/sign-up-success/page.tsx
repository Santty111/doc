import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Mail, ArrowLeft } from 'lucide-react'

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
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <CardTitle>Revise su Correo</CardTitle>
            <CardDescription>
              Hemos enviado un enlace de confirmación a su correo electrónico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Para completar su registro, haga clic en el enlace que enviamos a su correo. 
              Si no lo encuentra, revise su carpeta de spam.
            </p>
            
            <div className="rounded-lg bg-secondary p-4 text-sm">
              <p className="font-medium text-secondary-foreground">Próximos pasos:</p>
              <ol className="mt-2 list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Confirme su correo electrónico</li>
                <li>Inicie sesión en el sistema</li>
                <li>Un administrador le asignará una empresa y rol</li>
              </ol>
            </div>

            <Link href="/auth/login">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Iniciar Sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
