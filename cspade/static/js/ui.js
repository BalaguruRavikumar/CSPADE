Ui = function(){
	var self = this;
}

Ui.prototype.searchList = function(){
	var self = this;
	self.searchResultArray = {};
    self.searchResultIndex = 0;
    $("#searchInput").on('search', function(){
        self.searchSets($(this).val());
    });
    $("#searchInput").keyup(function(){
        self.searchSets($(this).val());
    });
    $("#upButton").hide();
    $("#downButton").hide();
    $("#upButton").on('click', function(){
        //console.log("----------");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function(){
            $(this).css("background", "#ff6");
        });
        self.searchResultIndex--;
        if(self.searchResultIndex < 0)
            self.searchResultIndex = self.searchResultArray.length - 1;
        if($(self.searchResultArray[self.searchResultIndex]).parent().parent().is(":hidden")){
            $(self.searchResultArray[self.searchResultIndex]).parent().parent().parent().find(".labelInParent").trigger('click');
        }
        var distance = $(self.searchResultArray[self.searchResultIndex]).offset().top - $('#checkBoxes').offset().top;
        if (distance < 0 || distance > $('#checkBoxes').height()) {
            //console.log($('#checkBoxes').height() + " " + $('#checkBoxes').scrollTop() + "  " + distance)
            $('#checkBoxes').animate({
                scrollTop: distance + $('#checkBoxes').scrollTop() - 30
            }, 'fast');
        }
        $("#searchResult").text((self.searchResultIndex + 1) + "/" + self.searchResultArray.length + " result(s)");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function(){
            $(this).css("background", "#fb954b");
        })
    });
    $("#downButton").on('click', function() {
        //console.log("++++++++++++++");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function () {
            $(this).css("background", "#ff6");
        });
        self.searchResultIndex++;
        if (self.searchResultIndex > self.searchResultArray.length - 1)
            self.searchResultIndex = 0;
        // if ($(self.searchResultArray[self.searchResultIndex]).parent().parent().is(":hidden")) {
        //     $(self.searchResultArray[self.searchResultIndex]).parent().parent().parent().find(".labelInParent").trigger('click');
        // }
        //scroll into view
        var distance = $(self.searchResultArray[self.searchResultIndex]).offset().top - $('#checkBoxes').offset().top;
        if (distance < 0 || distance > $('#checkBoxes').height()) {
            //console.log($('#checkBoxes').height() + " " + $('#checkBoxes').scrollTop() + "  " + distance)
            $('#checkBoxes').animate({
                scrollTop: distance + $('#checkBoxes').scrollTop() - 30
            }, 'fast');
        }
        $("#searchResult").text((self.searchResultIndex + 1) + "/" + self.searchResultArray.length + " result(s)");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function(){
            $(this).css("background", "#fb954b");
        })
    });
}

Ui.prototype.searchSets = function(text){
    //console.log("searchhhhhh");
    var self = this;
    if(self.searchResultArray.length > 0)
    self.searchResultArray.each(function(){
        $(this).html($(this).text());
    });
    var curText = text.trim();
    if(curText.length > 0)
    {
        self.searchResultArray = $("ul li")
            .find("label")
            .filter(function () {
                var matchStart = $(this).text().toLowerCase().indexOf(curText.toLowerCase());
                if(matchStart > -1){
                    var matchEnd = matchStart + curText.length - 1;
                    var beforeMatch = $(this).text().slice(0, matchStart);
                    var matchText = $(this).text().slice(matchStart, matchEnd + 1);
                    var afterMatch = $(this).text().slice(matchEnd + 1);
                    $(this).html(beforeMatch + "<em>" + matchText + "</em>" + afterMatch);
                    return true;
                }
                return false;
            });
        $("#searchResult").text(self.searchResultArray.length + " result(s)");
    }
    else {
        $("#searchResult").text("");
        self.searchResultArray.length = 0;
    }
    if(self.searchResultArray.length > 2)
    {
        $("#upButton").show();
        $("#downButton").show();
    }
    else{
        $("#upButton").hide();
        $("#downButton").hide();
    }
    if(self.searchResultArray.length > 0){
        // if($(self.searchResultArray[0]).parent().parent().is(":hidden")){
        //     $(self.searchResultArray[0]).parent().parent().parent().find(".labelInParent").trigger('click');
        // }
        //scroll into view
        var distance = $(self.searchResultArray[self.searchResultIndex]).offset().top - $('#checkBoxes').offset().top;
        if (distance < 0 || distance > $('#checkBoxes').height()) {
            //console.log($('#checkBoxes').height() + " " + $('#checkBoxes').scrollTop() + "  " + distance)
            $('#checkBoxes').animate({
                scrollTop: distance + $('#checkBoxes').scrollTop() - 30
            }, 'fast');
        }
        self.searchResultIndex = 0;
        $("#searchResult").text((self.searchResultIndex + 1) + "/" + self.searchResultArray.length + " result(s)");
    }
    //draw matched text background
    $(self.searchResultArray[0]).find("em").each(function(){
        $(this).css("background", "#fb954b");
    })
}

Ui.prototype.createLeftList = function(){
	var divEle = document.getElementById("checkBoxes");
	var ulElement = document.createElement("ul");
	divEle.appendChild(ulElement);

	mutation.forEach(function(d, i){
		var li = document.createElement("li");

		ulElement.appendChild(li);
        var inputElement = document.createElement("input");
        inputElement.id = "input" + d;
        inputElement.type = "checkbox";
        inputElement.value = d;

        //initial checkbox state
        var results = $.grep(activeMutation, function(e){
            return d == e.mutation;
        })
        if(results.length > 0) inputElement.checked = true;

        inputElement.addEventListener('click', function () {
            //console.log(this.value);
            if(this.checked){
                //console.log(activeMutation);
                if(activeMutation.length < 10){
                    activeMutation.push({
                        mutation: this.value,
                        color: colorQueue.pop()
                    })
                    
                    var results = $.grep(mutationDrug, function(e){
                    return e.mutation == d;
                })
                for(var j = 0; j < results.length; j++){
                    var drugs = $.grep(dataRow, function(e){
                        return e.drug == results[j].drug;
                    })
                    if(drugs.length > 0){
                        if(drugs.length > 1) console.log("multiple entries here!!!")
                        drugs[0].mutations.push({
                            mutation: d,
                            strength: results[j].ave
                        })
                        drugs[0].total += results[j].ave;
                    }
                    else {
                        dataRow.push({
                            drug: results[j].drug,
                            mutations: [{mutation: d, strength: results[j].ave}],
                            total: results[j].ave
                        })
                    }
                }

                    //update main vis
                    updateMutationHeader();
                    updateDataRow();
                    updateStacks();
                    updateStackOrderLength();
                    sortDataRows();

                }
                else this.checked = false;
            }
            else {
                var results = $.grep(activeMutation, function(e){
                    return d == e.mutation;
                })
                colorQueue.push(results[0].color);
                activeMutation.splice(activeMutation.indexOf(results[0]), 1)
                //console.log(activeMutation)

                for(var j = dataRow.length - 1; j > -1; j--){
                        var mu = dataRow[j].mutations;
                        var re = $.grep(mu, function(e){
                            return e.mutation == d;
                        })
                        if(re.length > 0){
                            //console.log(d);
                            dataRow[j].total -= re[0].strength;
                            mu.splice(mu.indexOf(re[0]), 1);
                            if(mu.length == 0) dataRow.splice(j, 1)
                        }
                    }

                //console.log(dataRow)
                //update main vis
                updateMutationHeader();
                updateDataRow();
                updateStacks();
                updateStackOrderLength();
                sortDataRows();

            }

        });

        var labelText = document.createElement("label");
        labelText.htmlFor = inputElement.id;
        labelText.appendChild(document.createTextNode(" " + d));
        li.appendChild(inputElement);
        li.appendChild(labelText).appendChild(document.createElement("br"));
	})
}

