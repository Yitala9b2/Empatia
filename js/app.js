(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) ;
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const data = [ {
        id: 1,
        name: "card winter 1",
        description: "карточка зима 1",
        season: "winter"
    }, {
        id: 2,
        name: "card winter 2",
        description: "карточка зима 2",
        season: "winter"
    }, {
        id: 3,
        name: "card winter 3",
        description: "карточка зима 3",
        season: "winter"
    }, {
        id: 4,
        name: "card winter 4",
        description: "карточка зима 4",
        season: "winter"
    }, {
        id: 5,
        name: "card winter 5",
        description: "карточка зима 5",
        season: "winter"
    }, {
        id: 6,
        name: "card winter 6",
        description: "карточка зима 6",
        season: "winter"
    }, {
        id: 7,
        name: "card winter 7",
        description: "карточка зима 7",
        season: "winter"
    }, {
        id: 8,
        name: "card winter 8",
        description: "карточка зима 8",
        season: "winter"
    }, {
        id: 9,
        name: "card winter 9",
        description: "карточка зима 9",
        season: "winter"
    }, {
        id: 10,
        name: "card winter 10",
        description: "карточка зима 10",
        season: "winter"
    }, {
        id: 11,
        name: "card winter 11",
        description: "карточка зима 11",
        season: "winter"
    }, {
        id: 12,
        name: "card winter 12",
        description: "карточка зима 12",
        season: "winter"
    }, {
        id: 13,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 14,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 15,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 16,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 17,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 18,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 19,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 20,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 21,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 22,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 23,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 24,
        name: "супер карта 3",
        description: "супер карточка весна",
        season: "spring"
    }, {
        id: 25,
        name: "card2",
        description: "карточка лето 2",
        season: "summer"
    }, {
        id: 26,
        name: "card2",
        description: "карточка лето 3",
        season: "summer"
    }, {
        id: 27,
        name: "card2",
        description: "карточка лето 4",
        season: "summer"
    }, {
        id: 28,
        name: "супер карта 3",
        description: "супер карточка лето 5",
        season: "summer"
    }, {
        id: 29,
        name: "супер карта 3",
        description: "супер карточка лето 5",
        season: "summer"
    }, {
        id: 30,
        name: "супер карта 3",
        description: "супер карточка лето 5",
        season: "summer"
    }, {
        id: 31,
        name: "супер карта 3",
        description: "супер карточка лето 5",
        season: "summer"
    }, {
        id: 32,
        name: "супер карта 3",
        description: "супер карточка лето 5",
        season: "summer"
    }, {
        id: 33,
        name: "супер карта 3",
        description: "супер карточка лето 5",
        season: "summer"
    }, {
        id: 34,
        name: "супер карта 3",
        description: "супер карточка лето 5",
        season: "summer"
    }, {
        id: 35,
        name: "супер карта 3",
        description: "супер карточка лето 5",
        season: "summer"
    }, {
        id: 36,
        name: "супер карта 3",
        description: "супер карточка лето 5",
        season: "summer"
    }, {
        id: 37,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 38,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 39,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 40,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 41,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 42,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 43,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 44,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 45,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 46,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 47,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    }, {
        id: 48,
        name: "супер карта 4",
        description: "супер карточка осень 5",
        season: "autumn"
    } ];
    const files_data = data;
    function renderTasks() {
        const boxWinter = document.querySelector("#tasks-winter");
        const boxSummer = document.querySelector("#tasks-summer");
        const boxSpring = document.querySelector("#tasks-spring");
        const boxAutumn = document.querySelector("#tasks-autumn");
        files_data.map((value => {
            const seasonRender = box => box.insertAdjacentHTML("beforeend", `<a href="#" data-popup="#popup">\n            <div id="${value.id}" class="taskItem ${value.season}">\n                <div>\n                <img src = "./img/empatia_logo2.svg" alt="">\n                </div>\n                <div class="taskItem__value">${value.id}</div>\n            </div>\n        </a>`);
            switch (value.season) {
              case "winter":
                seasonRender(boxWinter);
                break;

              case "spring":
                seasonRender(boxSpring);
                break;

              case "summer":
                seasonRender(boxSummer);
                break;

              case "autumn":
                seasonRender(boxAutumn);
                break;

              default:
                break;
            }
        }));
    }
    renderTasks();
    document.addEventListener("beforePopupOpen", (function(e) {
        const currentPopup = e.detail.popup;
        console.log(currentPopup);
        const handlElement = currentPopup.previousActiveElement.firstElementChild.id;
        console.log(handlElement);
        files_data.forEach((val => {
            if (val.id === handlElement) {
                console.log(currentPopup.targetOpen.element.firstElementChild.firstElementChild.lastElementChild);
                currentPopup.targetOpen.element.firstElementChild.firstElementChild.lastElementChild.innerText = 'ewfg';
            }
        }));
    }));
    window.FontAwesomeKitConfig = {
        asyncLoading: {
            enabled: false
        },
        autoA11y: {
            enabled: true
        },
        baseUrl: "https://ka-f.fontawesome.com",
        baseUrlKit: "https://kit.fontawesome.com",
        detectConflictsUntil: null,
        iconUploads: {},
        id: 13955998,
        license: "free",
        method: "css",
        minify: {
            enabled: true
        },
        token: "3f0ebcd4f3",
        v4FontFaceShim: {
            enabled: true
        },
        v4shim: {
            enabled: true
        },
        v5FontFaceShim: {
            enabled: true
        },
        version: "6.4.2"
    };
    !function(t) {
        "function" == typeof define && define.amd ? define("kit-loader", t) : t();
    }((function() {
        "use strict";
        function t(t, e) {
            var n = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
                var r = Object.getOwnPropertySymbols(t);
                e && (r = r.filter((function(e) {
                    return Object.getOwnPropertyDescriptor(t, e).enumerable;
                }))), n.push.apply(n, r);
            }
            return n;
        }
        function e(e) {
            for (var n = 1; n < arguments.length; n++) {
                var o = null != arguments[n] ? arguments[n] : {};
                n % 2 ? t(Object(o), !0).forEach((function(t) {
                    r(e, t, o[t]);
                })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(o)) : t(Object(o)).forEach((function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(o, t));
                }));
            }
            return e;
        }
        function n(t) {
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t;
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
            })(t);
        }
        function r(t, e, n) {
            return (e = function(t) {
                var e = function(t, e) {
                    if ("object" != typeof t || null === t) return t;
                    var n = t[Symbol.toPrimitive];
                    if (void 0 !== n) {
                        var r = n.call(t, e || "default");
                        if ("object" != typeof r) return r;
                        throw new TypeError("@@toPrimitive must return a primitive value.");
                    }
                    return ("string" === e ? String : Number)(t);
                }(t, "string");
                return "symbol" == typeof e ? e : String(e);
            }(e)) in t ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[e] = n, t;
        }
        function o(t, e) {
            return function(t) {
                if (Array.isArray(t)) return t;
            }(t) || function(t, e) {
                var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                if (null != n) {
                    var r, o, i, c, a = [], u = !0, f = !1;
                    try {
                        if (i = (n = n.call(t)).next, 0 === e) {
                            if (Object(n) !== n) return;
                            u = !1;
                        } else for (;!(u = (r = i.call(n)).done) && (a.push(r.value), a.length !== e); u = !0) ;
                    } catch (t) {
                        f = !0, o = t;
                    } finally {
                        try {
                            if (!u && null != n.return && (c = n.return(), Object(c) !== c)) return;
                        } finally {
                            if (f) throw o;
                        }
                    }
                    return a;
                }
            }(t, e) || function(t, e) {
                if (!t) return;
                if ("string" == typeof t) return i(t, e);
                var n = Object.prototype.toString.call(t).slice(8, -1);
                "Object" === n && t.constructor && (n = t.constructor.name);
                if ("Map" === n || "Set" === n) return Array.from(t);
                if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return i(t, e);
            }(t, e) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }();
        }
        function i(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
            return r;
        }
        function c(t, e) {
            var n = e && e.addOn || "", r = e && e.baseFilename || t.license + n, o = e && e.minify ? ".min" : "", i = e && e.fileSuffix || t.method, c = e && e.subdir || t.method;
            return t.baseUrl + "/releases/" + ("latest" === t.version ? "latest" : "v".concat(t.version)) + "/" + c + "/" + r + o + "." + i;
        }
        function a(t, e) {
            var n = e || [ "fa" ], r = "." + Array.prototype.join.call(n, ",."), o = t.querySelectorAll(r);
            Array.prototype.forEach.call(o, (function(e) {
                var n = e.getAttribute("title");
                e.setAttribute("aria-hidden", "true");
                var r = !e.nextElementSibling || !e.nextElementSibling.classList.contains("sr-only");
                if (n && r) {
                    var o = t.createElement("span");
                    o.innerHTML = n, o.classList.add("sr-only"), e.parentNode.insertBefore(o, e.nextSibling);
                }
            }));
        }
        var u, f = function() {}, s = "undefined" != typeof global && void 0 !== global.process && "function" == typeof global.process.emit, l = "undefined" == typeof setImmediate ? setTimeout : setImmediate, d = [];
        function h() {
            for (var t = 0; t < d.length; t++) d[t][0](d[t][1]);
            d = [], u = !1;
        }
        function m(t, e) {
            d.push([ t, e ]), u || (u = !0, l(h, 0));
        }
        function p(t) {
            var e = t.owner, n = e._state, r = e._data, o = t[n], i = t.then;
            if ("function" == typeof o) {
                n = "fulfilled";
                try {
                    r = o(r);
                } catch (t) {
                    g(i, t);
                }
            }
            v(i, r) || ("fulfilled" === n && b(i, r), "rejected" === n && g(i, r));
        }
        function v(t, e) {
            var r;
            try {
                if (t === e) throw new TypeError("A promises callback cannot return that same promise.");
                if (e && ("function" == typeof e || "object" === n(e))) {
                    var o = e.then;
                    if ("function" == typeof o) return o.call(e, (function(n) {
                        r || (r = !0, e === n ? y(t, n) : b(t, n));
                    }), (function(e) {
                        r || (r = !0, g(t, e));
                    })), !0;
                }
            } catch (e) {
                return r || g(t, e), !0;
            }
            return !1;
        }
        function b(t, e) {
            t !== e && v(t, e) || y(t, e);
        }
        function y(t, e) {
            "pending" === t._state && (t._state = "settled", t._data = e, m(A, t));
        }
        function g(t, e) {
            "pending" === t._state && (t._state = "settled", t._data = e, m(S, t));
        }
        function w(t) {
            t._then = t._then.forEach(p);
        }
        function A(t) {
            t._state = "fulfilled", w(t);
        }
        function S(t) {
            t._state = "rejected", w(t), !t._handled && s && global.process.emit("unhandledRejection", t._data, t);
        }
        function O(t) {
            global.process.emit("rejectionHandled", t);
        }
        function j(t) {
            if ("function" != typeof t) throw new TypeError("Promise resolver " + t + " is not a function");
            if (this instanceof j == !1) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
            this._then = [], function(t, e) {
                function n(t) {
                    g(e, t);
                }
                try {
                    t((function(t) {
                        b(e, t);
                    }), n);
                } catch (t) {
                    n(t);
                }
            }(t, this);
        }
        j.prototype = {
            constructor: j,
            _state: "pending",
            _then: null,
            _data: void 0,
            _handled: !1,
            then: function(t, e) {
                var n = {
                    owner: this,
                    then: new this.constructor(f),
                    fulfilled: t,
                    rejected: e
                };
                return !e && !t || this._handled || (this._handled = !0, "rejected" === this._state && s && m(O, this)), 
                "fulfilled" === this._state || "rejected" === this._state ? m(p, n) : this._then.push(n), 
                n.then;
            },
            catch: function(t) {
                return this.then(null, t);
            }
        }, j.all = function(t) {
            if (!Array.isArray(t)) throw new TypeError("You must pass an array to Promise.all().");
            return new j((function(e, n) {
                var r = [], o = 0;
                function i(t) {
                    return o++, function(n) {
                        r[t] = n, --o || e(r);
                    };
                }
                for (var c, a = 0; a < t.length; a++) (c = t[a]) && "function" == typeof c.then ? c.then(i(a), n) : r[a] = c;
                o || e(r);
            }));
        }, j.race = function(t) {
            if (!Array.isArray(t)) throw new TypeError("You must pass an array to Promise.race().");
            return new j((function(e, n) {
                for (var r, o = 0; o < t.length; o++) (r = t[o]) && "function" == typeof r.then ? r.then(e, n) : e(r);
            }));
        }, j.resolve = function(t) {
            return t && "object" === n(t) && t.constructor === j ? t : new j((function(e) {
                e(t);
            }));
        }, j.reject = function(t) {
            return new j((function(e, n) {
                n(t);
            }));
        };
        var E = "function" == typeof Promise ? Promise : j;
        function P(t, e) {
            var n = e.fetch, r = e.XMLHttpRequest, o = e.token, i = t;
            return o && !function(t) {
                return t.indexOf("kit-upload.css") > -1;
            }(t) && ("URLSearchParams" in window ? (i = new URL(t)).searchParams.set("token", o) : i = i + "?token=" + encodeURIComponent(o)), 
            i = i.toString(), new E((function(t, e) {
                if ("function" == typeof n) n(i, {
                    mode: "cors",
                    cache: "default"
                }).then((function(t) {
                    if (t.ok) return t.text();
                    throw new Error("");
                })).then((function(e) {
                    t(e);
                })).catch(e); else if ("function" == typeof r) {
                    var o = new r;
                    o.addEventListener("loadend", (function() {
                        this.responseText ? t(this.responseText) : e(new Error(""));
                    }));
                    [ "abort", "error", "timeout" ].map((function(t) {
                        o.addEventListener(t, (function() {
                            e(new Error(""));
                        }));
                    })), o.open("GET", i), o.send();
                } else e(new Error(""));
            }));
        }
        function _(t, e, n) {
            var r = t;
            return [ [ /(url\("?)\.\.\/\.\.\/\.\./g, function(t, n) {
                return "".concat(n).concat(e);
            } ], [ /(url\("?)\.\.\/webfonts/g, function(t, r) {
                return "".concat(r).concat(e, "/releases/v").concat(n, "/webfonts");
            } ], [ /(url\("?)https:\/\/kit-free([^.])*\.fontawesome\.com/g, function(t, n) {
                return "".concat(n).concat(e);
            } ] ].forEach((function(t) {
                var e = o(t, 2), n = e[0], i = e[1];
                r = r.replace(n, i);
            })), r;
        }
        function F(t, n) {
            var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {}, o = n.document || o, i = a.bind(a, o, [ "fa", "fab", "fas", "far", "fal", "fad", "fak" ]);
            t.autoA11y.enabled && r(i);
            var u = t.subsetPath && t.baseUrl + "/" + t.subsetPath, f = [ {
                id: "fa-main",
                addOn: void 0,
                url: u
            } ];
            if (t.v4shim && t.v4shim.enabled && f.push({
                id: "fa-v4-shims",
                addOn: "-v4-shims"
            }), t.v5FontFaceShim && t.v5FontFaceShim.enabled && f.push({
                id: "fa-v5-font-face",
                addOn: "-v5-font-face"
            }), t.v4FontFaceShim && t.v4FontFaceShim.enabled && f.push({
                id: "fa-v4-font-face",
                addOn: "-v4-font-face"
            }), !u && t.customIconsCssPath) {
                var s = t.customIconsCssPath.indexOf("kit-upload.css") > -1 ? t.baseUrlKit : t.baseUrl, l = s + "/" + t.customIconsCssPath;
                f.push({
                    id: "fa-kit-upload",
                    url: l
                });
            }
            var d = f.map((function(r) {
                return new E((function(o, i) {
                    var a = r.url || c(t, {
                        addOn: r.addOn,
                        minify: t.minify.enabled
                    }), u = {
                        id: r.id
                    }, f = t.subset ? u : e(e(e({}, n), u), {}, {
                        baseUrl: t.baseUrl,
                        version: t.version,
                        id: r.id,
                        contentFilter: function(t, e) {
                            return _(t, e.baseUrl, e.version);
                        }
                    });
                    P(a, n).then((function(t) {
                        o(C(t, f));
                    })).catch(i);
                }));
            }));
            return E.all(d);
        }
        function C(t, e) {
            var n = e.contentFilter || function(t, e) {
                return t;
            }, r = document.createElement("style"), o = document.createTextNode(n(t, e));
            return r.appendChild(o), r.media = "all", e.id && r.setAttribute("id", e.id), e && e.detectingConflicts && e.detectionIgnoreAttr && r.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), 
            r;
        }
        function I(t, n) {
            n.autoA11y = t.autoA11y.enabled, "pro" === t.license && (n.autoFetchSvg = !0, n.fetchSvgFrom = t.baseUrl + "/releases/" + ("latest" === t.version ? "latest" : "v".concat(t.version)) + "/svgs", 
            n.fetchUploadedSvgFrom = t.uploadsUrl);
            var r = [];
            return t.v4shim.enabled && r.push(new E((function(r, o) {
                P(c(t, {
                    addOn: "-v4-shims",
                    minify: t.minify.enabled
                }), n).then((function(t) {
                    r(U(t, e(e({}, n), {}, {
                        id: "fa-v4-shims"
                    })));
                })).catch(o);
            }))), r.push(new E((function(r, o) {
                P(t.subsetPath && t.baseUrl + "/" + t.subsetPath || c(t, {
                    minify: t.minify.enabled
                }), n).then((function(t) {
                    var o = U(t, e(e({}, n), {}, {
                        id: "fa-main"
                    }));
                    r(function(t, e) {
                        var n = e && void 0 !== e.autoFetchSvg ? e.autoFetchSvg : void 0, r = e && void 0 !== e.autoA11y ? e.autoA11y : void 0;
                        void 0 !== r && t.setAttribute("data-auto-a11y", r ? "true" : "false");
                        n && (t.setAttributeNode(document.createAttribute("data-auto-fetch-svg")), t.setAttribute("data-fetch-svg-from", e.fetchSvgFrom), 
                        t.setAttribute("data-fetch-uploaded-svg-from", e.fetchUploadedSvgFrom));
                        return t;
                    }(o, n));
                })).catch(o);
            }))), E.all(r);
        }
        function U(t, e) {
            var n = document.createElement("SCRIPT"), r = document.createTextNode(t);
            return n.appendChild(r), n.referrerPolicy = "strict-origin", e.id && n.setAttribute("id", e.id), 
            e && e.detectingConflicts && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), 
            n;
        }
        function T(t) {
            var e, n = [], r = document, o = r.documentElement.doScroll, i = (o ? /^loaded|^c/ : /^loaded|^i|^c/).test(r.readyState);
            i || r.addEventListener("DOMContentLoaded", e = function() {
                for (r.removeEventListener("DOMContentLoaded", e), i = 1; e = n.shift(); ) e();
            }), i ? setTimeout(t, 0) : n.push(t);
        }
        function L(t) {
            "undefined" != typeof MutationObserver && new MutationObserver(t).observe(document, {
                childList: !0,
                subtree: !0
            });
        }
        try {
            if (window.FontAwesomeKitConfig) {
                var k = window.FontAwesomeKitConfig, x = {
                    detectingConflicts: k.detectConflictsUntil && new Date <= new Date(k.detectConflictsUntil),
                    detectionIgnoreAttr: "data-fa-detection-ignore",
                    fetch: window.fetch,
                    token: k.token,
                    XMLHttpRequest: window.XMLHttpRequest,
                    document
                }, M = document.currentScript, N = M ? M.parentElement : document.head;
                (function() {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    return "js" === t.method ? I(t, e) : "css" === t.method ? F(t, e, (function(t) {
                        T(t), L(t);
                    })) : void 0;
                })(k, x).then((function(t) {
                    t.map((function(t) {
                        try {
                            N.insertBefore(t, M ? M.nextSibling : null);
                        } catch (e) {
                            N.appendChild(t);
                        }
                    })), x.detectingConflicts && M && T((function() {
                        M.setAttributeNode(document.createAttribute(x.detectionIgnoreAttr));
                        var t = function(t, e) {
                            var n = document.createElement("script");
                            return e && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), 
                            n.src = c(t, {
                                baseFilename: "conflict-detection",
                                fileSuffix: "js",
                                subdir: "js",
                                minify: t.minify.enabled
                            }), n;
                        }(k, x);
                        document.body.appendChild(t);
                    }));
                })).catch((function(t) {
                    console.error("".concat("Font Awesome Kit:", " ").concat(t));
                }));
            }
        } catch (t) {
            console.error("".concat("Font Awesome Kit:", " ").concat(t));
        }
    }));
    window["FLS"] = true;
    isWebp();
})();
