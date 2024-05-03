const socket = new WebSocket('ws://localhost:3000');

const chatDiv = document.getElementById('chat');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Función para convertir códigos de atajos de emoji en emojis visuales
function convertShortcodesToEmoji(message) {
    const shortcodeMap = {
        ':)': '😊',
        ':(': '😞',
        ':D': '😃',
        ':O': '😲',
        ';)': '😉',
        ':P': '😛',
        ':|': '😐',
        ':*': '😘',
        '<3': '❤️',
        ':thumbsup:': '👍',
        ':thumbsdown:': '👎',
        ':heart:': '❤️',
        ':rocket:': '🚀',
        ':smile_cat:': '😺',
        ':laughing:': '😆',
        ':sunglasses:': '😎',
        ':thinking:': '🤔',
        ':angry:': '😠',
        ':fire:': '🔥',
        ':moneybag:': '💰',
        ':cake:': '🍰',
        ':beer:': '🍺',
        ':pizza:': '🍕',
        ':tada:': '🎉',
        ':100:': '💯',
        ':sunny:': '☀️',
        ':rain_cloud:': '🌧️',
        ':snowflake:': '❄️',
        ':star:': '⭐',
        ':thumbsup_light_skin_tone:': '👍🏻',
        ':thumbsup_medium_light_skin_tone:': '👍🏼',
        ':thumbsup_medium_skin_tone:': '👍🏽',
        ':thumbsup_medium_dark_skin_tone:': '👍🏾',
        ':thumbsup_dark_skin_tone:': '👍🏿'
    };

    // Reemplazamos cada código de atajo con su emoji correspondiente
    Object.keys(shortcodeMap).forEach(shortcode => {
        const emoji = shortcodeMap[shortcode];
        const regex = new RegExp(shortcode.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        message = message.replace(regex, emoji);
    });

    return message;
}

// Manejo de mensajes recibidos
socket.onmessage = function (event) {
    event.data.text().then(function (message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message__receive');
        messageElement.textContent = convertShortcodesToEmoji(message);
        chatDiv.appendChild(messageElement);
    }).catch(function (error) {
        console.error('Error al leer el mensaje recibido:', error);
    });
};

// Envío de mensajes al servidor
function sendMessage() {
    // Obtener el contenido del input de texto
    const message = messageInput.value.trim();

    // Verificar si el mensaje no está vacío
    if (message !== '') {
        // Convertimos códigos de atajos de emoji en emojis visuales
        const messageWithEmojis = convertShortcodesToEmoji(message);

        // Mostrar el mensaje en el chat
        const messageElement = document.createElement('div');
        messageElement.classList.add('message__me');
        messageElement.textContent = messageWithEmojis;
        chatDiv.appendChild(messageElement);

        // Limpiar el campo de entrada
        messageInput.value = '';

        // Enviar el mensaje al servidor
        socket.send(message);
    }
}

// Evento al presionar el botón de enviar
sendButton.addEventListener('click', sendMessage);

// Evento al presionar Enter en el campo de entrada
messageInput.addEventListener('keypress', function (event) {
    // Verificar si la tecla presionada es Enter
    if (event.key === 'Enter') {
        // Evitar que se envíe el formulario (si lo hay)
        event.preventDefault();
        sendMessage();
    }
});
