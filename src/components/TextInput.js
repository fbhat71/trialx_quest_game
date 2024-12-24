export default class TextInput {
    constructor(scene, x, y, width, height, options = {}) {
        this.scene = scene;
        this.value = '';
        this.isFocused = false;
        this.blinkCounter = 0;
        this.maxLength = options.maxLength || 50;
        
        const {
            fontSize = '24px',
            placeholder = '',
            multiline = false
        } = options;

        // Create container
        this.container = scene.add.container(x, y);

        // Background
        this.background = scene.add.rectangle(0, 0, width, height, 0xf8f9fa)
            .setStrokeStyle(2, 0x3498db)
            .setInteractive();

        // Text
        this.textDisplay = scene.add.text(-width/2 + 10, -height/2 + 10, '', {
            fontSize: fontSize,
            fill: '#2c3e50',
            fontFamily: 'Arial',
            wordWrap: { width: width - 20 }
        });

        // Cursor
        this.cursor = scene.add.text(
            this.textDisplay.x, 
            this.textDisplay.y, 
            '|', 
            {
                fontSize: fontSize,
                fill: '#2c3e50',
                fontFamily: 'Arial'
            }
        );
        this.cursor.visible = false;

        // Add elements to container
        this.container.add([this.background, this.textDisplay, this.cursor]);

        // Setup interactions
        this.setupInteractions();

        // Start cursor blink animation
        this.startCursorBlink();
    }

    setupInteractions() {
        // Click to focus
        this.background.on('pointerdown', () => {
            this.focus();
        });

        // Global click to check for blur
        this.scene.input.on('pointerdown', (pointer, gameObjects) => {
            if (!gameObjects.includes(this.background)) {
                this.blur();
            }
        });

        // Remove any existing keyboard listeners
        if (this.keyboardListener) {
            this.scene.input.keyboard.removeListener('keydown', this.keyboardListener);
        }

        // Keyboard input
        this.keyboardListener = (event) => {
            if (!this.isFocused) return;

            if (event.keyCode === 8) { // Backspace
                this.value = this.value.slice(0, -1);
                this.updateText();
            } 
            else if (event.keyCode === 32) { // Space
                if (this.value.length < this.maxLength) {
                    this.value += ' ';
                    this.updateText();
                }
            }
            else if ((event.keyCode >= 48 && event.keyCode <= 90) || // Numbers and letters
                     (event.keyCode >= 96 && event.keyCode <= 111) || // Numpad
                     (event.keyCode >= 186 && event.keyCode <= 222)) { // Special characters
                if (this.value.length < this.maxLength) {
                    this.value += event.key;
                    this.updateText();
                }
            }
        };

        this.scene.input.keyboard.on('keydown', this.keyboardListener);
    }

    focus() {
        this.isFocused = true;
        this.background.setStrokeStyle(3, 0x2980b9);
        this.cursor.visible = true;
        this.updateText();
    }

    blur() {
        this.isFocused = false;
        this.background.setStrokeStyle(2, 0x3498db);
        this.cursor.visible = false;
    }

    updateText() {
        this.textDisplay.setText(this.value);
        // Update cursor position
        this.cursor.x = this.textDisplay.x + this.textDisplay.width + 2;
        this.cursor.y = this.textDisplay.y;
    }

    startCursorBlink() {
        if (this.blinkEvent) {
            this.blinkEvent.remove();
        }
        
        this.blinkEvent = this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.isFocused) {
                    this.cursor.visible = !this.cursor.visible;
                }
            },
            loop: true
        });
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
        this.updateText();
    }

    destroy() {
        if (this.blinkEvent) {
            this.blinkEvent.remove();
        }
        if (this.keyboardListener) {
            this.scene.input.keyboard.removeListener('keydown', this.keyboardListener);
        }
        this.container.destroy();
    }
} 