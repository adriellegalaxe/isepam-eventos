// Componente Button
class Button {
    static create(text, options = {}) {
        const {
            variant = 'primary',
            size = 'md',
            onClick = () => {},
            disabled = false,
            className = '',
            type = 'button',
        } = options;

        const baseStyles = 'font-semibold rounded-lg transition cursor-pointer';
        
        const variants = {
            primary: 'bg-blue-900 text-white hover:bg-blue-800 disabled:bg-gray-400',
            secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-300',
            danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
        };

        const sizes = {
            sm: 'px-3 py-1 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        const button = document.createElement('button');
        button.type = type;
        button.textContent = text;
        button.className = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
        button.disabled = disabled;
        button.onclick = onClick;

        return button;
    }
}
