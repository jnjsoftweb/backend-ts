const { mouse, left, right, up, down } = require("@nut-tree-fork/nut-js");

(async () => {
    await mouse.move(left(500));
    await mouse.move(up(500));
    await mouse.move(right(500));
    await mouse.move(down(500))
})();
// const {
//     preloadLanguages,
//     Language,
//     LanguageModelType,
//     configure,
// } = require("@nut-tree-fork/plugin-ocr");

// configure({ languageModelType: LanguageModelType.BEST });

// useConsoleLogger({ logLevel: ConsoleLogLevel.DEBUG });

// screen.config.autoHighlight = true;
// screen.config.ocrConfidence = 0.8;

// function activeWindowRegion() {
//     return getActiveWindow().then((activeWindow) => activeWindow.region);
// }

// (async () => {
//     await preloadLanguages([Language.English], [LanguageModelType.BEST]);
//     await sleep(5000);
//     const result = await screen.find(singleWord("@nut-tree-fork/nut-js"));
//     await mouse.move(straightTo(centerOf(result)));
//     await mouse.click(Button.LEFT);
//     await screen.waitFor(singleWord("Native"), 15000, 1000, {
//         providerData: { partialMatch: true },
//     });
//     const content = await screen.read({ searchRegion: activeWindowRegion() });
//     console.log(content);
// })();