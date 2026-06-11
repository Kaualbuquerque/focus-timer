import { Flame } from "lucide-react"
import { HeaderProps } from "../types/components"

export function Header({ date = new Date() }: HeaderProps) {

    // Formatar data
    const formatDate = (d: Date): string => {
        const dias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
        const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

        const dia = dias[d.getDay()]
        const numDia = d.getDate()
        const mes = meses[d.getMonth()]

        return `${dia}, ${numDia} de ${mes}`
    }

    return(
        <header className="flex items-center justify-between py-6 px-8 border-b border-none">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
                <div className="icon-box">
                    <Flame size={24} className="text-primary"/>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-xl font-semibold text-foreground">Focus</h1>
                    <p className="text-xs text-muted-foreground">Timer de estudos</p>
                </div>
            </div>

            {/* Date */}
            <time className="text-sm text-muted-foreground">
                {formatDate(date)}
            </time>
        </header>
    )
}