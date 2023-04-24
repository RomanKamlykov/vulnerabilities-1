import {createApp} from './app';
import * as process from "process";

function main() {
    try {
        createApp().listen(process.env.PORT, () => {
            console.log(new Date().toISOString(), `App is running at http://localhost:${process.env.PORT}/`);
        });
    } catch (e) {
        console.error(new Date().toISOString(), e);
        process.exit(1);
    }
}

main();
