function get_uv() {
    var site = "http://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/"
    var zip = document.getElementById("zip").value;
    var am_or_pm;
    if (zip.length !== 5) {
        alert("This is not a valid zip code. Please make sure it is 5 digits long")
    }
    else {
        document.getElementById("uv_value").innerHTML = "Loading..."
        document.getElementById("recommend").innerHTML = "";
        var redirect = site + zip.toString() + "/JSON";
        console.log(redirect);
        var hour = Number(new Date().getHours());
        console.log(hour % 12);
        if (hour / 12 >= 1) {
            console.log("PM");
            am_or_pm = "PM";
        }
        else {
            console.log("AM");
            am_or_pm = "AM";
        }

        var reg_hour = hour % 12;
        if (reg_hour == 0) {
            reg_hour = 12;
        }

        var four_am = reg_hour.toString() + am_or_pm === "4AM";
        var five_am = reg_hour.toString() + am_or_pm === "5AM";
        var six_am = reg_hour.toString() + am_or_pm === "6AM"

        if (four_am || five_am || six_am) {
            reg_hour = 1;
        }

        $.ajax({
            url: redirect,
            success: handleResult
        });
        function handleResult(result){
            var info;
            for (var i= 0; i < result.length; i++) {

                var correct_hour = Number(result[i].DATE_TIME.substring(12,14)) == reg_hour;
                var correct_aorp = am_or_pm == result[i].DATE_TIME.substring(15);
                if (correct_hour && correct_aorp) {
                    document.getElementById("uv_value").innerHTML = ("The current UV value for this area is <div style='display:inline-block' id='uval'>" + result[i].UV_VALUE +"</div>.</br>");
                }
                /*
                 document.getElementById("test").innerHTML += (result[i].DATE_TIME + " " + result[i].UV_VALUE +"</br>");

                 console.log(Number(result[i].DATE_TIME.substring(12,14)));
                 console.log(result[i].DATE_TIME.substring(15));

                 document.getElementById("a").innerHTML += result[i].DATE_TIME.substring(12);
                 document.getElementById("a").innerHTML += "</br>";

                 console.log(result[i]);
                 info += result[i];
                 info += "</br>";*/
            }
            //document.getElementById("test").innerHTML = result;
            //document.getElementById("a").innerHTML = info;
            console.log("done");
            document.getElementById("determine").style.display = "block";
        }
    }
}

function show(classy) {
    classy = classy.id.substring(2);
    var advice = document.getElementById("advice");
    var elements = document.getElementsByClassName(classy);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
    }

    switch (classy) {
        case "extreme":
            advice.innerHTML = "<b>11+: Extreme</b></br></br>" +
            "Extreme risk of harm from unprotected sun exposure. Try to avoid the sun from 10 a.m. to 4 p.m. \
            Apply sunscreen heavily every 2 hours. \
            Be very careful. Unprotected skin can burn in minutes. White sand and bright objects will increase UV exposure.\
            Seek shade, cover up, wear a hat and sunglasses, and use sunscreen.";
            advice.style.color = "purple";
            break
        case "very_high":
            advice.innerHTML = "<b>8 - 10: Very High</b></br></br>" +
            "Very high risk of harm from unprotected sun exposure. \
            Minimize sun exposure from 10 a.m. to 4 p.m. \
            Protect yourself by applying sunscreen.\
            Wear protective clothing and sunglasses to protect your eyes. \
            Take extra precautions. Unprotected skin will be damaged and can burn quickly.";
            advice.style.color = "#e60073";
            break
        case "high":
            advice.innerHTML = "<b>6-7: High</b></br></br>" +
            "High risk of harm from unprotected sun exposure.\
            Apply sunscreen. Wear a wide-brim hat and sunglasses to protect your eyes.\
            Protection against sunburn is needed.\
            Reduce time in the sun between 10 a.m. and 4 p.m.\
            Cover up, wear a hat and sunglasses, and use sunscreen.";
            advice.style.color = "orange";
            break
        case "moderate":
            advice.innerHTML = "<b>3-5: Moderate</b></br></br>" +
            "Moderate risk of harm from unprotected sun exposure.\
            Take precautions, such as covering up, if you will be outside.\
            Stay in shade near midday when the sun is strongest."
            advice.style.color = "#ffdf32";
            break
        case "low":
            advice.innerHTML = "<b>2 or less: Low</b></br></br>" +
            "Low danger from the sun's UV rays for the average person.\
            Wear sunglasses on bright days. In winter, reflection off snow can nearly double UV strength.\
            If you burn easily, cover up and use sunscreen."
            advice.style.color = "green";
            break
    }

}

function hide(classy) {
    classy = classy.id.substring(2);
    var elements = document.getElementsByClassName(classy);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }
}


function tone_select (tone) {
    toner = document.getElementById(tone.id + "-");
    toner.checked = true;
    var tones = document.getElementsByClassName("tone");
    for (var i=0; i < tones.length; i++) {
        tones[i].style.border = "none";
    }
    tone.style.border = "2px solid yellow";
}

function diagnose() {
    var skin_tone;
    if (document.getElementById('tone1-').checked) {
        skin_tone = 67;
    }
    if (document.getElementById('tone2-').checked) {
        skin_tone = 100;
    }
    if (document.getElementById('tone3-').checked) {
        skin_tone = 200;
    }
    if (document.getElementById('tone4-').checked) {
        skin_tone = 300;
    }
    if (document.getElementById('tone5-').checked) {
        skin_tone = 400;
    }
    if (document.getElementById('tone6-').checked) {
        skin_tone = 500;
    }
    var uv_value = Number(document.getElementById("uval").innerHTML);
    var recommend = document.getElementById("recommend");
    console.log(Number(document.getElementById("uval").innerHTML));
    recommend.innerHTML = "Recommendation:</br></br>"
    if (uv_value == 0) {
        recommend.innerHTML += "There is no recommendation for how you long can be outside at this time.</br>"
    }
    else {
        var minutes = Math.round(skin_tone / uv_value);
        if (minutes >= 60) {
            minutes = (minutes / 60).toFixed(0).toString() + " hour " + (minutes % 60).toString();
        }
        recommend.innerHTML += "It is recommended that you remain outside for no longer than " + minutes.toString() + " minutes without any type of UV protection.</br>";
    }

    switch (skin_tone) {
        case 67:
            recommend.innerHTML += "A sunscreen of SPF 50 is highly recommended during sunny times.";
            break
        case 100:
            recommend.innerHTML += "A sunscreen of SPF 50 is highly recommended during sunny times.";
            break
        case 200:
            recommend.innerHTML += "A sunscreen of SPF 45 is highly recommended during sunny times.";
            break
        case 300:
            recommend.innerHTML += "A sunscreen of SPF 30 is highly recommended during sunny times.";
            break
        case 400:
            recommend.innerHTML += "A sunscreen of SPF 15 is highly recommended during sunny times.";
            break
        case 500:
            recommend.innerHTML += "A sunscreen of SPF 15 is highly recommended during sunny times.";
            break
    }

}