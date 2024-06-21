
# Google Ad Manager Impressions and Clicks Tracker
Script to track Google Ad Manager Impressions and Clicks, it will generate some ecommerce model pushed to Google Tag Manager dataLayer. ( Feel free to adapt the code over your needs)

# Data Mappings

|dataLayer Key |Ad Source Field|
|--|--|
|promotion_name | adUnitPath |
|promotion_id| campaignId|
|creative_name| creativeId|
|creative_slot| adUrl|


# dataLayer Pushes Examples

## View Promotion
    window.dataLayer.push({
        event: 'view_promotion',
        ecommerce: {
            items: [{
                    promotion_name: {{adUnitPath}},
                    promotion_id: {{campaignId}},
                    creative_name: {{creativeId}},
                    creative_slot: {{adUrl}}
                }
            ]
        }
    });
    

## Select Promotion

    window.dataLayer.push({
        event: 'select_promotion',
        ecommerce: {
            items: [{
                    promotion_name: {{adUnitPath}},
                    promotion_id: {{campaignId}},
                    creative_name: {{creativeId}},
                    creative_slot: {{adUrl}}
                }
            ]
        }
    });
    

# Debug

Adding `&ad_debug=1` to your browser bar will make the script to print some verbose information to the console
