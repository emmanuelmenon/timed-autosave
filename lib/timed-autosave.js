'use babel';

import TimedAutosaveView from './timed-autosave-view';
import {CompositeDisposable} from 'atom';

let saveTime;
let saveNecessary;
isEnabled = true;

export default {
    config: {
        saveTime_cfg: {
            title: 'How often do you want to save?',
            description: 'Minutes between autosaves',
            type: 'number',
            default: 2.5,
            minimum: 0.0167
        }
    },

    subscriptions: null,

    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'timed-autosave:mainFunc': () => this.mainFunc()
        }));

        console.log("activated");
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    mainFunc() {
        saveTime = atom.config.get("timed-autosave.saveTime_cfg") * 60000;

        if (isEnabled) {
            console.log("Package 'timed-autosave' is enabled" )
        }
        else {
            console.log("Package 'timed-autosave' is disabled" )
        }

        function execSave() {
            saveNecessary=atom.workspace.observeTextEditors(editor => {editor.isModified()});

            if (saveNecessary){
                atom.workspace.observeTextEditors(editor => {
                    Promise.resolve(editor.save()).then(() => atom.notifications.addSuccess("Saved!")).catch((error) => atom.notifications.addError(error));
                });
            }

            setTimeout(execSave, saveTime);
        }

        execSave();
    }
}
