

//     const windowHeight = this.getWindowHeight();
//     const docHeight = this.getDocHeight();
//     const scrollPosition = this.getScrollPosition();
//     const percentOfPage = this.getPercent(windowHeight, docHeight, scrollPosition);
//     this.statsObj.scrollData.push({"gmtTime": new Date().getTime(),
//                                   "scrollPosition": scrollPosition,
//                                   "percentOfPage": percentOfPage,
//                                   "windowHeight": windowHeight,
//                                   "docHeight": docHeight,
//                                   "event": event
//                         })
//  return percentOfPage;

        getPercent: function(windowHeight, docHeight, scrollPosition) {
            const result = ((scrollPosition + windowHeight) / docHeight) * 100;
            return Math.floor(result);
        },

        getScrollPosition: function() {
            return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        },

        getWindowHeight: function() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
        },

        getDocHeight: function() {
            return Math.max(
                document.body.scrollHeight || 0,
                document.documentElement.scrollHeight || 0,
                document.body.offsetHeight || 0,
                document.documentElement.offsetHeight || 0,
                document.body.clientHeight || 0,
                document.documentElement.clientHeight || 0
            );
        }
