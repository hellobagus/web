import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { linkifier } from 'react-linkifier';
import './analytics';
import 'normalize.css';
import 'animate.css';
import '../css/main.styl';

const
    CMD_HELP = 'help',
    CMD_WHOAMI = 'whoami',
    CMD_PROJECTS = 'projects',
    CMD_GITHUB = 'github',
    CMD_LINKEDIN = 'linkedin',
    CMD_CLEAR = 'clear',
    CMD_OOPS = 'oops';

class Terminal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            lines: generateInitialInfo()
        };
        this.history = [];
        this.historyIndex = -1;
        this.keysPressed = [];
    }

    render() {
        const { input, lines } = this.state;

        return <div id="terminal">
            <ul>
                {lines.map(line => <li>
                    {line.substring(0, 2) === '> ' ? 
                        <pre><span className="prompt">> </span>{linkify(line.substring(2))}</pre> : 
                        <pre>{linkify(line)}</pre>}
                </li>)}
            </ul>
            <form onSubmit={this.onSubmit}>      
                <label className="prompt">> </label>
                <input 
                    autoFocus
                    className="cli-input"
                    type="text" 
                    value={input} 
                    onChange={this.onInputChange.bind(this)}
                    onKeyPress={this.onKeyPress.bind(this)}
                    onKeyDown={this.onKeyDown.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                />      
            </form>
        </div>;
    }

    componentDidUpdate() {
        setPromptInView();
    }

    onSubmit(event) {
        event.preventDefault();
    }

    onInputChange(event) {
        this.historyIndex = -1;
        this.setState({ input: event.target.value });
    }

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.processInput();
        }
    }

    processInput() {
        const input = this.state.input.trim();
        const command = getCommand(input);
        const newLines = generateOutput(input);

        const oldLines = command === CMD_CLEAR ? [] : this.state.lines;

        this.history = [...this.history, input].filter(i => i !== '');
        this.historyIndex = -1;
        this.setState({
            input: '',
            lines: [
                ...oldLines,
                '> ' + input,
                ...newLines
            ]
        });
    }

    onKeyDown(event) {
        setPromptInView();
        this.keysPressed[event.keyCode] = true;
        // Ctrl + c
        if (this.keysPressed[17] && this.keysPressed[67]) {
            this.processInterrupt();
        }
        // Up arrow
        else if (event.keyCode === 38) {
            this.navigateHistoryUp();
        }
        // Down arrow
        else if (event.keyCode === 40) {
            this.navigateHistoryDown();
        }
    }

    processInterrupt() {
        this.historyIndex = -1;
        this.setState({
            input: '',
            lines: [
                ...this.state.lines,
                '> ' + this.state.input
            ]
        });
    }

    onKeyUp(event) {
        this.keysPressed[event.keyCode] = false;
    }

    navigateHistoryUp() {
        const { history, historyIndex } = this;

        if (history.length === 0) {
            return;
        }

        let newIndex;
        if (historyIndex === -1) {
            newIndex = history.length - 1;
        } else {
            newIndex = Math.max(0, historyIndex - 1);
        }

        this.historyIndex = newIndex;
        this.setState({ input: history[newIndex] });
    }

    navigateHistoryDown() {
        const { history, historyIndex } = this;

        if (historyIndex !== -1) {
            const newIndex = Math.min(history.length - 1, historyIndex + 1);
            this.historyIndex = newIndex;
            this.setState({ input: history[newIndex] });
        }
    }
};

const getCommand = input => {
    const items = input.split(' ').filter(i => i !== '');
    if (items.length === 0) {
        return undefined;
    }
    return items.shift();
};

const generateOutput = input => {
    const command = getCommand(input);
    const args = input.split(' ').slice(1);
    switch (command) {
        case undefined:
            return [];
        case CMD_HELP:
            return generateHelp();
        case CMD_WHOAMI:
            return generatePersonalInfo();
        case CMD_PROJECTS:
            return generateProjects();
        case CMD_GITHUB:
            return generateGithub();
        case CMD_LINKEDIN:
            return generateLinkedIn();
        case CMD_CLEAR:
            return [];
        case CMD_OOPS:
            return generateOops();
        default:
            return [`Command not found: ${command}`];
    }
};

const generateInitialInfo = () => {
    return [
        'Welcome to HelloBagus...',
        'Please type \'help\' command to show the help menu'
    ];
};

const generateHelp = () => {
    return [
        ` `,
        `   ${CMD_HELP}           Show help menu`,
        `   ${CMD_WHOAMI}         Show personal info`,
        `   ${CMD_PROJECTS}       Show some of my projects`,
        `   ${CMD_GITHUB}         Go to my Github page`,
        `   ${CMD_LINKEDIN}       Go to my LinkedIn page`,
        `   ${CMD_CLEAR}          Clear terminal output`,
        `   ${CMD_OOPS}           Oops`,
        ` `
    ];
};

const generatePersonalInfo = () => {
    return [
        '',
        '   Hi! My name is Bagus Tri Nanda.',
        '   I am a Front End Developer living in Jakarta, Indonesia.',
        '',
        '   While previously I\'ve been more focused on UI/UX and FrontEnd,',
        '   nowadays I\'m mostly excited about building stuff with JS, React & React Native.',
        '',
    ];
};

const generateProjects = () => {
    return [
        '',
        '   IFCA PROPERTY365 - a mobile app for property made with React Native',
        '   https://play.google.com/store/apps/developer?id=IFCA+PROPERTY365+INDONESIA',
        '',
        '   IFCA PROPERTY365 - a Web app',
        '   http://35.198.219.220:2121/ifca_splus_v2/',
        '',
        '   PADANG BULAN - a Mobile app',
        '   https://play.google.com/store/apps/details?id=com.padangbulan.app',
        '',
        '   HYPERMART',
        '   http://www.hypermart.co.id/',
        '',
        '   FRANCIS ARTISAN BAKERY',
        '   http://www.francisartisanbakery.com/',
        '',
        '   ELEVENIA',
        '   http://www.elevenia.co.id/',
        '',
        '   PRICEBOOK',
        '   http://www.pricebook.co.id/',
        '',
    ];
};

const generateGithub = () => {
    window.open('https://github.com/hellobagus');
    return [
        'https://github.com/hellobagus'
    ];
};

const generateLinkedIn = () => {
    window.open('https://www.linkedin.com/in/bagus-trinanda-b34a2342/');
    return [
        'https://www.linkedin.com/in/bagus-trinanda-b34a2342/'
    ];
};

const generateOops = () => {
    setInterval(modifyRandomElement.bind(this, effects.wobble), 100);
    setInterval(modifyRandomElement.bind(this, effects.hinge), 500);
    setInterval(modifyRandomElement.bind(this, effects.comic), 5000);
    return ['Did I do that?'];
};

const getRand = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min)) + min;
};

const splitIntoWords = elem => {
    let items = elem.innerText
        .split(' ')
        .map(i => [' ', i]);

    return []
        .concat(...items)
        .slice(1)
        .filter(i => i !== '')
        .map(item => createPre(item, elem.className));
};

const splitIntoLetters = elem => {
    return elem.innerText
        .split('')
        .filter(i => i !== '')
        .map(letter => createPre(letter, elem.className));
};

const createPre = (text, className) => {
    const elem = document.createElement('pre');
    elem.innerText = text;
    elem.className = className;
    return elem;
};

const effects = {
    comic: [splitIntoWords, item => {
        item.innerText = 'Comic Sans is ♥';
        item.className += ' comic-font';
    }],
    hinge: [splitIntoWords, item => item.className += ' animated hinge'],
    wobble: [splitIntoWords, item => item.className += ' animated wobble']
};

const modifyRandomElement = effect => {
    const [splitFunc, applyEffect] = effect;

    const elems = Array.from(document.querySelectorAll('pre:not(.hinge)'))
        // Select only elements with at least 1 character which is not space or line break
        .filter(elem => elem.innerText.replace(/[\s\r]/, '') !== '');

    if (elems.length === 0) {
        return;
    }

    const elem = elems[getRand(0, elems.length - 1)];
    const items = splitFunc(elem);

    elem.replaceWith(...items);
    const eligibleItems = items.filter(item => item.innerText !== ' ');
    applyEffect(eligibleItems[getRand(0, eligibleItems.length - 1)]);
};

const setPromptInView = () => {
    const prompt = document.querySelector('#terminal > form');
    const { height, top } = prompt.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // If prompt not fully in view, then scroll to bottom
    if (height + top > windowHeight) {
        window.scrollTo(0, document.body.scrollHeight);
    }
};

const linkify = text => linkifier(text, {target: '_blank'});

ReactDOM.render(
    <Terminal/>,
    document.getElementById('root')
);

document.body.addEventListener("click", () => {
    document.querySelector('#terminal input').focus()
});
