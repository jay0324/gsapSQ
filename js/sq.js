/**
* gsapSQ continous scroller animation plugin for gsap
* Author: Jay Hsu
* Date: 2022-04-14
*/

(function ($, document, window) {
    "use strict";
    $.fn.gsapSQ = function (options) {
        const defaults = {
            triggerId: '#SqBox',
            path: 'img',
            amount: 6,
            rwd: true,
            rwdTrigger: 991,
            endTrigger: 1000,
            rwdEndTrigger: 1500,
            canvasWidth: '1920',
            canvasHeight: '615',
            canvasRwdWidth: 960,
            canvasRwdHeight: 1184
        };
        options = $.extend(defaults, options);
        const triggerId = options.triggerId;
        const path = options.path;
        const amount = options.amount;
        const rwd = options.rwd;
        const rwdTrigger = options.rwdTrigger;
        const endTrigger = options.endTrigger;
        const rwdEndTrigger = options.rwdEndTrigger;
        const canvasWidth = options.canvasWidth;
        const canvasHeight = options.canvasHeight;
        const canvasRwdWidth = options.canvasRwdWidth;
        const canvasRwdHeight = options.canvasRwdHeight;
        const domId = $(this).attr('id');
        const canvas = document.getElementById(domId);
        const context = canvas.getContext("2d");
        let win = {
            w: $(window).width(),
            h: $(window).height(),
        };
        let folder = path+'/desktop';
        let end = '+='+endTrigger;
        let minusH = 107;

        const init = () => {
            resize();
            render();
            if ($(window).width() <= 991) minusH = 44;
            $('canvas', triggerId).height($(window).height()-minusH);
            $('canvas', triggerId).width($(window).width());

            setTimeout(function(){
                $(triggerId+' .loader').fadeOut(500);
            },500);
        };

        if (rwd && $(window).width() > rwdTrigger) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        }else{
            canvas.width = canvasRwdWidth;
            canvas.height = canvasRwdHeight;
            folder = path+'/mobile';
            end = '+='+rwdEndTrigger;
        }

        const frameCount = amount;
        const currentFrame = index => (
            `${folder}/${(index + 1).toString().padStart(2, '0')}.jpg`
        );

        let images = []
        let sqimg = {
            frame: 0
        };

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        gsap.to(sqimg, {
            frame: frameCount-1,
            snap: "frame",
            scrollTrigger: {
                trigger: triggerId,
                start: "top",
                end: end,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                scrub: true,
                markers: false
            },
            onUpdate: render
        });

        images[0].onload = init;

        function render() {
            context.clearRect(0, 0, win.w, win.h);
            coverImg(context, images[sqimg.frame], 'cover');
        }

        function coverImg(context, img, type = 'cover') {
            const imgRatio = img.height / img.width;
            const winRatio = win.h / win.w;

            if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) {
                const h = win.w * imgRatio;
                context.drawImage(img, 0, (win.h - h) / 2, win.w, h);
            }
            if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) {
                const w = win.w * winRatio / imgRatio;
                context.drawImage(img, (win.w - w) / 2, 0, w, win.h);
            }

            
            if ($(window).width() >= 1900) {
                context.drawImage(img, 0, 0, 1920, win.h);
            }
        }

        const resize = () => {
            win.w = $(window).width();
            win.h = $(window).height();
            canvas.width = win.w;
            canvas.height = win.h;
            canvas.style.width = `${win.w}px`;
            canvas.style.height = `${win.h}px`;
        }
        window.addEventListener('resize', init)

    }
}(jQuery, document, window));