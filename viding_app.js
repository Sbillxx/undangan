/**
 * Viding Studio Theme 73 - Interactive Application Logic
 * Matches studio.viding.co/theme/preview/73
 */

$(document).ready(function () {
    // -------------------------------------------------------------
    // 1. Guest Name Personalization from URL
    // -------------------------------------------------------------
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const guestName = getUrlParameter('to') || getUrlParameter('u') || getUrlParameter('guest') || getUrlParameter('p');
    if (guestName) {
        $('#guest-name').text(guestName);
        $('input[name="name"]').val(guestName);
        $('input[name="wisher_name"]').val(guestName);
    }

    // -------------------------------------------------------------
    // 2. Audio Control & Autoplay
    // -------------------------------------------------------------
    const audio = document.getElementById("audioElement");
    const musicBtn = $("#floatingMusicBtn");
    const musicIcon = $("#musicIcon");
    let isPlaying = false;

    function playMusic() {
        if (audio) {
            audio.play().then(() => {
                isPlaying = true;
                musicIcon.removeClass("fa-music").addClass("fa-pause");
            }).catch(e => {
                console.log("Audio autoplay prevented:", e);
            });
        }
    }

    function pauseMusic() {
        if (audio) {
            audio.pause();
            isPlaying = false;
            musicIcon.removeClass("fa-pause").addClass("fa-music");
        }
    }

    musicBtn.on("click", function () {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    // -------------------------------------------------------------
    // 3. Open Cover Button (Rise Animation)
    // -------------------------------------------------------------
    $("#btnOpenInvitation").on("click", function () {
        $("#studioCover").addClass("opened");
        playMusic();

        // Smooth scroll to top of content
        $("html, body").animate({ scrollTop: 0 }, 600);
    });

    // -------------------------------------------------------------
    // 4. Real-time Countdown Timer
    // -------------------------------------------------------------
    const weddingDate = new Date("2026-10-29T09:00:00+07:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            $("#cd-days").text(days < 10 ? "0" + days : days);
            $("#cd-hours").text(hours < 10 ? "0" + hours : hours);
            $("#cd-minutes").text(minutes < 10 ? "0" + minutes : minutes);
            $("#cd-seconds").text(seconds < 10 ? "0" + seconds : seconds);
        } else {
            $("#cd-days").text("00");
            $("#cd-hours").text("00");
            $("#cd-minutes").text("00");
            $("#cd-seconds").text("00");
        }
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // -------------------------------------------------------------
    // 5. Copy Account Number to Clipboard
    // -------------------------------------------------------------
    window.copyAccount = function (id, bankName) {
        const accountNumber = $("#" + id).text().trim();
        navigator.clipboard.writeText(accountNumber).then(function () {
            if (typeof iziToast !== "undefined") {
                iziToast.success({
                    title: 'Berhasil Disalin!',
                    message: bankName + ': ' + accountNumber,
                    position: 'bottomCenter',
                    timeout: 2500
                });
            } else {
                alert(bankName + ' nomor rekening ' + accountNumber + ' berhasil disalin!');
            }
        });
    };

    // -------------------------------------------------------------
    // 6. RSVP Submission
    // -------------------------------------------------------------
    $("#rsvpForm").on("submit", function (e) {
        e.preventDefault();
        const guest = $(this).find('input[name="name"]').val();
        
        if (typeof iziToast !== "undefined") {
            iziToast.success({
                title: 'RSVP Terkirim!',
                message: 'Terima kasih atas konfirmasi kehadiran Anda, ' + guest,
                position: 'bottomCenter',
                timeout: 3000
            });
        }
        
        $(this).html(`
            <div style="text-align: center; padding: 20px 10px;">
                <i class="fas fa-check-circle" style="font-size: 38px; color: #6a503e; margin-bottom: 12px;"></i>
                <h4 style="font-size: 18px; margin-bottom: 8px;">Terima Kasih!</h4>
                <p style="font-size: 13px; color: #555; margin: 0;">Konfirmasi kehadiran Anda telah berhasil kami simpan.</p>
            </div>
        `);
    });

    // -------------------------------------------------------------
    // 7. Wedding Wishes / Guestbook with LocalStorage
    // -------------------------------------------------------------
    const defaultWishes = [
        {
            name: "Sarah & David",
            message: "Congrats on your wedding day! Wishing you both a lifetime of love, joy, and endless happiness together."
        },
        {
            name: "Rian Firmansyah",
            message: "Selamat menempuh hidup baru Vidi & Hening! Semoga senantiasa sakinah, mawaddah, warahmah."
        },
        {
            name: "Nadia Saraswati",
            message: "Happy Wedding! So thrilled for both of you. May your journey ahead be blessed with smiles and laughter!"
        }
    ];

    function loadWishes() {
        const stored = localStorage.getItem("viding_studio73_wishes");
        let list = defaultWishes;
        if (stored) {
            try {
                list = JSON.parse(stored);
            } catch (err) {
                list = defaultWishes;
            }
        }
        renderWishes(list);
    }

    function renderWishes(list) {
        let html = '';
        list.forEach(function (item) {
            html += `
                <div class="wish-card-item">
                    <div class="wish-author">${item.name}</div>
                    <div class="wish-message">${item.message}</div>
                </div>
            `;
        });
        $("#wishesList").html(html);
    }

    loadWishes();

    $("#wishesForm").on("submit", function (e) {
        e.preventDefault();
        const author = $(this).find('input[name="wisher_name"]').val().trim();
        const msg = $(this).find('textarea[name="wisher_message"]').val().trim();

        if (!author || !msg) return;

        const stored = localStorage.getItem("viding_studio73_wishes");
        let list = defaultWishes;
        if (stored) {
            try {
                list = JSON.parse(stored);
            } catch (err) {
                list = defaultWishes;
            }
        }

        list.unshift({ name: author, message: msg });
        localStorage.setItem("viding_studio73_wishes", JSON.stringify(list));
        renderWishes(list);

        $(this).find('textarea[name="wisher_message"]').val('');

        if (typeof iziToast !== "undefined") {
            iziToast.success({
                title: 'Ucapan Terkirim!',
                message: 'Doa restu Anda telah dipublikasikan.',
                position: 'bottomCenter',
                timeout: 2500
            });
        }
    });
});