export function TopGlow() {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '300px',
                background: 'radial-gradient(ellipse 400px 350px at center top, oklch(0.6795 0.1263 270 / 0.075), transparent 80%)',
                zIndex: 9999,
                pointerEvents: 'none',
            }}
        />
    )
}