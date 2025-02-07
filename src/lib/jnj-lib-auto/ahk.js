// https://github.com/biga-ahk/biga.ahk
// Autohotkey 객체를 쉽게 다룰 수 있게 해주는 biga.ahk 라이브러리

const ahk = await require('ahknodejs')(require('ahk2.exe'))

ahk.run("Send, {LWin down}{LWin up}");
