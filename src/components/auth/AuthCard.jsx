import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCard({ title, description, children, className = "" }) {
    return (
        <Card className={`w-full shadow-lg border-0 ${className}`}>
            <CardHeader className="text-center space-y-2 pb-6">
                <CardTitle className="text-2xl font-bold text-text-primary">{title}</CardTitle>
                {description && (
                    <CardDescription className="text-text-secondary text-base">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {children}
            </CardContent>
        </Card>
    )
}
