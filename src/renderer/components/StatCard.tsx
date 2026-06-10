import { StatCardProps } from "../types/components";

export function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="card flex flex-col items-center justify-center text-center py-8">
            <div className="flex items-center gap-2 mb-3">
                <div className="text-primary">
                    {icon}
                </div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {label}
                </span>
            </div>

            <div className="text-3xl font-bold font-mono text-foreground">
                {value}
            </div>
        </div>
    )
}