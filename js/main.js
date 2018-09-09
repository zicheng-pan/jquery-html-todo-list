;(function () {
    'use strict';
    // console.log('jquery',jQuery);
    var $addTaskForm = $('.add_task')
        , $delete_index = null
        , $detail_task = null
        , $task_detail_mask = $('.task_detail_mask')
        , $task_detail_div = $('.task_detail')
        , $task_detail_content = $('#task_detail_content')
        , task_list = []
        , $task_content = $('.content')
        , $task_content_input = null
        , $task_checkbox = null
        , $msg = $('.msg')
        , $msg_content = $msg.find('.msg-content')
        , $msg_confirm = $msg.find('.confirmed')
        , $alerter = $('.alerter')
    ;

    init();
    $addTaskForm.on('submit', function (e) {
        var new_task = {};
        e.preventDefault();
        var $input = $(this).find('input[name=content]');
        new_task.content = $input.val();
        // console.log('new_task',new_task);
        // 如果新存入的数值为空，则直接返回
        if (!new_task.content) return;
        //　存入　storage
        storeTaskList(new_task);
        renderTaskList();
        $input.val(null);
    });

    function hideTaskDiv() {
        $task_detail_mask.hide();
        $task_detail_div.hide();
    }


    function hide_msg() {
        $msg.hide();
    }

    function show_msg(msg) {
        if (!msg) return;

        $msg_content.html(msg);
        $alerter.get(0).play();
        $msg.show();
    }

    function listen_msg_event() {
        $msg_confirm.on('click', function () {
            hide_msg();
        })
    }

    function notifiy(task, index) {
        show_msg(task);
    }


    function startRemind() {
        var current_time, task_time;
        var itl = setInterval(function () {
            for (var i = 0; i < task_list.length; i++) {
                if ((!task_list[i] || !task_list[i].date || task_list[i].notified == true))
                    continue;
                current_time = (new Date()).getTime();
                // console.log("task_time-current_time:", task_time, current_time);
                task_time = (new Date(task_list[i].date)).getTime();
                if (current_time - task_time >= 1) {
                    console.log(task_list[i].notified);
                    updateTask(i, {'notified': true});
                    notifiy(task_list[i].content, i);
                }
            }
        }, 500);

    }


    function init() {
        listen_msg_event();
        task_list = store.get('task_list') || [];
        if (task_list.length > 0) {
            renderTaskList()
        }
        $task_detail_mask.on("click", function () {
            hideTaskDiv()
        });

        // 设置 提醒
        startRemind();
    }

    function storeTaskList(new_task) {
        task_list.push(new_task);
        store.set('task_list', task_list);
    }

    function renderTpl(data, index) {
        if ((index != 0) && (!data || !index))
            return;
        var iscomplete = data.iscompleted == true ? "checked" : "";
        var task_item_tpl =
            '<div class="taskitem" data-index="' + index + '">' +
            '<span><input type="checkbox" class="complete"' + iscomplete + ' style="margin-right:10px;"></span>' +
            '<span class="task_content">' + data.content + '</span>' +
            '<span class="fr">' +
            '<span class="action delete">delete</span>' +
            '<span class="action detail">detail</span>' +
            '</span>' +
            '</div>';
        // console.log('temp_task_item',task_item_tpl);
        return $(task_item_tpl);

    }

    function renderTaskDetailTpl(index) {

        var task = task_list[index];
        // console.log('task.desc === undefined',task.desc === undefined);
        var task_desc = task.desc === undefined ? "" : task.desc;
        var task_detail_tpl =
            '<form>' +
            '<div class="content task_detail_item">' + task.content + '</div>' +
            '<div><input class="task_detail_item" type="text" name="content" value="' + task.content + '" style="display: none;"></div>' +
            '<textarea name="task_desc" class="desc task_detail_item">' + task_desc + '</textarea>' +
            '<div class="remind">' +
            '<input class="task_detail_item datetime" name="task_date" type="text" value="' + (task.date || '') + '">' +
            '<button class="task_detail_item" type="submit">submit</button>' +
            '</div>' +
            '</form>'
        ;
        $task_detail_content.html(task_detail_tpl);
        var $task_detail_form = $task_detail_content.find('form');
        $task_detail_form.find("[name=task_date]").datetimepicker();
        $task_detail_form.on('submit', function (e) {
            e.preventDefault();
            var task_desc = $task_detail_form.find("[name=task_desc]").val();
            var task_date = $task_detail_form.find("[name=task_date]").val();
            var content = $task_detail_form.find("[name=content]").val();
            // console.log(task_desc,task_date);
            task.desc = task_desc;
            task.date = task_date;
            if ((new Date(task.date)).getTime() - (new Date()).getTime() >= 1)
                task.notified = false;
            task_list[index] = task;
            task.content = content;
            store.set('task_list', task_list);
            renderTaskList();
            hideTaskDiv();
        });
        $task_detail_form.find('.content').on('dblclick', function () {
            $task_content_input = $task_detail_form.find('[name=content]');
            $task_content_input.show();
            $task_detail_form.find('.content').hide();
        });


    }

    function updateTask(index, data) {
        if (!index && !task_list[index])
            return;
        task_list[index] = $.extend({}, task_list[index], data);
        store.set('task_list', task_list);
        renderTaskList();
    }

    function renderTaskList() {

        var $tasklist = $('.tasklist') || [];
        $tasklist.html(null);
        var completeTaskList = [];
        for (var x = 0; x < task_list.length; x++) {
            var task_i = task_list[x];
            if (task_i && task_i.iscompleted) {
                completeTaskList.push(x);
                continue;
            }
            var $task_item = renderTpl(task_i, x);
            $tasklist.prepend($task_item);
        }
        for (var j = 0; j < completeTaskList.length; j++) {
            var $task_item = renderTpl(task_list[completeTaskList[j]], completeTaskList[j]);
            if ($task_item) {
                $task_item.addClass('iscompleted');
            }
            $tasklist.append($task_item);
        }
        // action 和 delete 是同级
        $delete_index = $('.action.delete');
        // console.log('delete_index',$delete_index);
        $tasklist.find('.taskitem').on('dblclick', function () {
            // console.log('index',index);
            // 设置content detail div的样式
            var index = $(this).data('index');
            renderTaskDetailTpl(index);
            // 点击并且弹框
            $task_detail_mask.show();
            $task_detail_div.show();
        });
        $delete_index.on("click", function () {
            var $this = $(this);
            var index = $this.parent().parent().data('index');
            // 判断是否执行 delete
            var temp = confirm("if delete this task?");
            temp ? deleteTaskItem(index) : null;
            // if(deleteTaskItem(index))
            //     alert('delete successfully');
        });

        //add detail button click event
        $detail_task = $('.action.detail');
        $detail_task.on("click", function () {
            var $this = $(this);
            var index = $this.parent().parent().data('index');
            // console.log('index',index);
            // 设置content detail div的样式
            renderTaskDetailTpl(index);
            // 点击并且弹框
            $task_detail_mask.show();
            $task_detail_div.show();
        });

        $task_checkbox = $(".taskitem .complete");
        $task_checkbox.on('click', function () {
            var $this = $(this);
            var index = $this.parent().parent().data('index');
            if ($this.is(':checked')) {
                updateTask(index, {'iscompleted': true});
            }
            else {
                updateTask(index, {'iscompleted': false});
            }
        });


    }

    //delete task item
    function deleteTaskItem(index) {
        console.log(task_list[index]);
        if (index === undefined || !task_list[index]) return;
        delete task_list[index];
        store.set('task_list', task_list);
        renderTaskList();
        return true;
    }

})();