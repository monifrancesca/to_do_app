$(document).ready(function() {
    $('.submit-button').on('click', postData);

// create an empty array to hold each task object
    var taskArray = [];
// create empty object to store values
    var values = {};


// event listener for click of submit button
    $('.addTodoForm').on('submit', function (e) {
        e.preventDefault();

        // strips everything out of the form - .each is a built in for-loop - makes the property dynamically and copies it into the values object
        // field.value, field.name - name & value are a property of the object
        $.each($('.addTodoForm').serializeArray(), function (i, field) {
            values[field.name] = field.value;
        });

        // logic that stores info
        taskArray.push(values);
        console.log('This is values pushed into an array: ' + taskArray);


        // submit button clears out the form by looking for any input with the type of text in the taskInput id, then putting an empty string into it
        $('#taskInput').find('input[type=text]').val('');

        // call to the function that writes to the DOM
        appendDom(values);
        console.log(values);
    });


    // function to append task info to the DOM
    function appendDom(taskInfo) {
        // select a holding container that already exists. Put in an empty div.
        $('.complimentary').append('<div><ul></ul></div>');
        // Select that container and have it grab it's last child and store it into the $el variable.
        var $el = $('.complimentary').children().last();
        // store a remove button in the $btn variable
        var $btn = $('<button class="remove">Remove</button>')
        //$($btn).on('click', removeDom);

        // task info appended to the DOM
        $el.append('<li><strong>Task Name:</strong> ' + taskInfo.taskName + '</li>');
    }

});


function postData() {
    event.preventDefault();

    var values = {};
    $.each($('.addTodoForm').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    $.ajax({
        type: 'POST',
        url: '/task',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });

}

function getData() {
    $.ajax({
        type: 'GET',
        url: '/task',
        success: function(data) {
            // loop through each task
            data.forEach(function(task, i) {
                $('.complimentary').append('<h2>Show task</h2>' +
                    '<p>' +
                    task.task_name +
                    '</p>');
            });

            //$('.domShow').append('<span>' + data[0].name + '</span>');

            console.log(data);
        }
    });
}
