(function() {
    // Copyright Analytics Debugger S.L.U. All Rights Reserved. 2024
    // Author: David Vallejo
    // Date: 2024-06-21
    // Name: Google Publisher Tag Impressions and Clicks Tracker
    // This file is licensed under the MIT License.
    // License text available at https://opensource.org/licenses/MIT  
  
    // Add ?ad_debug=1 for debugging messages
    var debug = document.location.search.includes('ad_debug=1') ? true : false;
    // Init googletag variable, jic
    window.googletag = window.googletag || {
        cmd: []
    };
    // Init googletag variable, jic
    window.dataLayer = window.dataLayer || [];
    // Our variable for holding the impressions info. Used for grabbing the data on click
    window.__gpt_impressions = window.__gpt_impressions || [];

    // Helper function to extract the ad destination URL from the Ad HTML
    var getAdUrl = function(adHtmlString) {
        // Step 1: Extract all 'a' tags with 'href' attributes
        var aTagRegex = /<a\s+[^>]*href\s*=\s*["']?([^"'>\s]+)["']?[^>]*>/gi;

        let matches;
        var hrefs = [];

        while ((matches = aTagRegex.exec(adHtmlString)) !== null) {
            hrefs.push(matches[1]); // Capture the 'href' value
        }

        // Step 2: Filter hrefs that contain the 'adurl' parameter
        var adurlHrefs = hrefs.filter(href => href.includes('adurl='));

        // Step 3: Extract the 'adurl' parameter value from these hrefs
        var adurlValues = adurlHrefs.map(href => {
            var urlParams = new URLSearchParams(href.split('?')[1]);
            return urlParams.get('adurl');
        });
        if (adurlValues.length > 0) return adurlValues[0];
    }
    // Adding the impression Listener
    googletag.cmd.push(function() {
        googletag.pubads().addEventListener("impressionViewable", (event) => {
            // We have an impression, let's get the holder iframe reference and add the click event.
            document.querySelector('#' + event.slot.getSlotElementId() + ' iframe').contentWindow.document.body.onclick = function(e) {
                var impressionInfo = window.__gpt_impressions.filter(function(e) {
                    if (e.promotion_name === event.slot.getSlotElementId()) return true;
                });
                window.dataLayer.push({
                    event: 'select_promotion',
                    ecommerce: {
                        items: [impressionInfo]
                    }
                })
                if (debug === true) console.log("GPT AD CLICK", impressionInfo);
            }

            var slotDetails = event.slot.getResponseInformation();
            try {
                var impressionInfo = {
                    promotion_name: event.slot.getSlotId().getDomId(),
                    promotion_id: slotDetails.campaignId.toString(),
                    creative_name: slotDetails.creativeId.toString(),
                    creative_slot: getAdUrl(event.slot.getHtml())
                }
                window.dataLayer.push({
                    event: 'view_promotion',
                    ecommerce: {
                        items: [impressionInfo]
                    }
                });
                window.__gpt_impressions.push(impressionInfo);
                console.log("GPT AD IMPRESSION", impressionInfo);
            } catch (e) {
		            if (debug === true) console.log("GPT ERROR GRABBING IMPRESSION DETAILS: ", e);
	          }
        });
    });
})()
