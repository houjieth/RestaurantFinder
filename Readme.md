HOW TO RUN
==========

Simply host index.html, app.js and app.css under the same folder. Open your browser and points to the host folder.


HOW TO USE IT
=============
You can search using the following fields:

    <City>        e.g. "San Francisco, CA"

    <Zip>         e.g. "98109"

    <Latitude>    e.g. "40.0"
    <Longitude>   e.g. "-122.0"
    TIPS: You may not want to manually input that. Just click "Locate me" and the browser will fill it for you.

    <Food Type>   e.g. "Wok"
    TIPS: You can manually input food type, or select one from the dropdown menu.

Then click "Search" button. The first 50 result will be listed.


HOW DID I MAKE IT
=================
I just want to make a single page application with all the logic and code running in the browser.
To do this, I mainly used Backbone for data modeling, templating, rendering and making ajax call to the server.
I also use some jQuery to handle button click events and UI responsiveness.


WHY IT LOOKS SO NAIVE
=====================
Didn't spend long time on coding. So please bare with the rough edges when using it.
