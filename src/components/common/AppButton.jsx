const variantStyles = {
    primary: {
        background: 'var(--color-accent)',
    },
    ghost: {
        background: 'transparent',
        boxShadow: 'none',
        textDecoration: 'underline',
    },
    danger: {
        background: '#FF5C5C',
    },
}

function AppButton({
    children,
    variant = 'primary',
    icon: Icon,
    onClick,
    type = 'button',
    disabled = false,
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...variantStyles[variant],
            }}
        >
            {Icon && <Icon size={16} />}
            {children}
        </button>
    )
}

export default AppButton