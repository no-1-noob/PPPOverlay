# PPPOverlay

A stream overlay for use with v1.0.2+ of https://github.com/no-1-noob/PPPredictor
![image](https://github.com/no-1-noob/PPPOverlay/assets/91905916/764f8c1b-aad1-4e84-a828-e7861bd0dc25)

## How to use

Just use https://mods.no1noob.net/PPPOverlay as a browse Source in your steaming software:

![image](https://github.com/no-1-noob/PPPOverlay/assets/91905916/e730b8d5-875b-4fcc-a28b-de5b2d1293ee)

### Options
You can change the url to make some changes e.g.: https://mods.no1noob.net/PPPOverlay?ip=1.1.1.1&port=1234 to change ip and port used (port in the PPPredictor mod has to match)

-  ip
-  port
-  position
    - topleft
    - topright
    - bottomleft
    - bottomright
- backgroundStyle
    - bgBlack (mainly used for debugging without obs)

## Developing

- Install NodeJS https://nodejs.org/en/download
- Open terminal/commandline in the folder where the package.json is located
    - execute ```npm install``` in the terminal
    - install angular cli ```npm i -g @angular/cli``` (maybe admin rights needed depending on your user profile)
    - ```ng serve```
        -> after build completes it should be available at "http://localhost:4200/"
