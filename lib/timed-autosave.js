'use babel';

import TimedAutosaveView from './timed-autosave-view';
import {
    CompositeDisposable
} from 'atom';

let saveTime;

export default {
    config: {
        saveTime_cfg: {
            title: 'How often do you want to save?',
            description: 'Minutes between autosaves',
            type: 'number',
            default: 2.5,
            minimum: 1
        }
    },

    timedAutosaveView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        saveTime = atom.config.get("timed-autosave.saveTime_cfg");
        this.timedAutosaveView = new TimedAutosaveView(state.timedAutosaveViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.timedAutosaveView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'timed-autosave:toggle': () => this.toggle()
        }));

        setInterval(atom.workspace.observeActivePaneItem(editor => {
            Promise.resolve(editor.save()).then(() => console.log('Saved')).catch((error) => console.log(error));
        }), saveTime * 60000);
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.timedAutosaveView.destroy();
    },

    serialize() {
        return {
            timedAutosaveViewState: this.timedAutosaveView.serialize()
        };
    },

    toggle() {
        console.log('TimedAutosave was toggled!');
        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );
    }
}
