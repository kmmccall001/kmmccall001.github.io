/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    document.getElementById("petananimal").addEventListener("change", picktheanimal);


    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    let catmedia = new Media('Kitten-Meow-SoundBible.com-1295572573.mp3',
        function() { console.log('Media constructed'); });
    let purr = function() {
        console.log('Playing...');
        catmedia.play();
    }
    document.getElementById('kitten').addEventListener('click', purr, false);

    
   
    let wolfmedia = new Media('wolf-howling-sound-effect.mp3',
        function() { console.log('Media constructed'); });
    let howl = function() {
        console.log('Playing...');
        wolfmedia.play();
    }
    document.getElementById('wolf').addEventListener('click', howl, false);
    
    
    
    let duckmedia = new Media('Duck-quack.mp3',
    function() { console.log('Media constructed'); });
    let quack = function() {
    console.log('Playing...');
    duckmedia.play();
    }
    document.getElementById('duck').addEventListener('click', quack, false);



    let ravenmedia = new Media('raven-sounds.mp3',
        function() { console.log('Media constructed'); });
    let caw = function() {
        console.log('Playing...');
        ravenmedia.play();
    }
    document.getElementById('raven').addEventListener('click', caw, false);

    
    let tigermedia = new Media('tiger-sound.mp3',
        function() { console.log('Media constructed'); });
    let roar = function() {
        console.log('Playing...');
        tigermedia.play();
    }
    document.getElementById('tiger').addEventListener('click', roar, false);




    let dreadwolfmedia = new Media('Solas.Isuspectyouhavequestions.mp3',
        function() { console.log('Media constructed'); });
    let solas = function() {
        console.log('Playing...');
        dreadwolfmedia.play();
    }
    document.getElementById('dreadwolf').addEventListener('click', solas, false);
}

function picktheanimal(){
    
    let animallist = document.getElementsByClassName("animal")
    for (let i = 0; i < animallist.length; i ++){
        animallist[i].classList.add("hidden")
    }
    document.getElementById(document.getElementById("petananimal").value).classList.remove("hidden");
}



