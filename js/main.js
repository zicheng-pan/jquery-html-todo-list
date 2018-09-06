
;(function(){
    'use strict';
    // console.log('jquery',jQuery);
    var $addTaskForm = $('.add_task')
        ,$delete_index=null
        ,$detail_task=null
        ,$task_detail_mask=$('.task_detail_mask')
        ,$task_detail_div=$('.task_detail')
        ,$task_detail_content=$('#task_detail_content')
        ,task_list = []
        ,$task_content=$('.content')
        ,$task_content_input=null
    ;

    init();
    $addTaskForm.on('submit',function(e){
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

    function hideTaskDiv(){
        $task_detail_mask.hide();
        $task_detail_div.hide();
    }

    function init(){
        task_list = store.get('task_list') || [];
        if(task_list.length>0){
            renderTaskList()
        }
        $task_detail_mask.on("click",function(){
            hideTaskDiv()
        });

    }

    function storeTaskList(new_task){
        task_list.push(new_task);
        store.set('task_list',task_list);
    }

    function renderTpl(data,index){
        if((index != 0) && (!data || !index))
            return;

        var task_item_tpl =
            '<div class="taskitem" data-index="'+ index +'">' +
            '<span><input type="checkbox" style="margin-right:10px;"></span>' +
            '<span class="task_content">'+data.content+'</span>' +
            '<span class="fr">'+
            '<span class="action delete">delete</span>' +
            '<span class="action detail">detail</span>' +
            '</span>'+
            '</div>';
        // console.log('temp_task_item',task_item_tpl);
        return $(task_item_tpl);

    }

    function renderTaskDetailTpl(index){
        console.log('index',index);

        var task = task_list[index];
        // console.log('task.desc === undefined',task.desc === undefined);
        var task_desc = task.desc === undefined ? "" : task.desc;
        var task_detail_tpl=
            '<form>' +
            '<div class="content task_detail_item">'+task.content+'</div>' +
            '<div><input class="task_detail_item" type="text" name="content" value="'+ task.content +'" style="display: none;"></div>' +
            '<textarea name="task_desc" class="desc task_detail_item">'+ task_desc +'</textarea>' +
            '<div class="remind">' +
            '<input class="task_detail_item" name="task_date" type="date" value="'+ task.date +'">' +
            '<button class="task_detail_item" type="submit">submit</button>' +
            '</div>' +
            '</form>'
            ;
        console.log('task_detail_tpl',task_detail_tpl);
        $task_detail_content.html(task_detail_tpl);
        var $task_detail_form = $task_detail_content.find('form');
        $task_detail_form.on('submit',function(e){
            e.preventDefault();
            var task_desc = $task_detail_form.find("[name=task_desc]").val();
            var task_date = $task_detail_form.find("[name=task_date]").val();
            var content = $task_detail_form.find("[name=content]").val();
            // console.log(task_desc,task_date);
            task.desc = task_desc;
            task.date = task_date;
            task_list[index] = task;
            task.content = content;
            store.set('task_list',task_list);
            renderTaskList();
            hideTaskDiv();
        });
        $task_detail_form.find('.content').on('dblclick',function(){
            $task_content_input = $task_detail_form.find('[name=content]')
            $task_content_input.show();
            $task_detail_form.find('.content').hide();
        });


    }

    function renderTaskList(){

        var $tasklist =  $('.tasklist') || [];
        $tasklist.html(null);
        for ( var x=0; x<task_list.length; x++){
            var $task_item = renderTpl(task_list[x],x);
            $tasklist.prepend($task_item);
        }
        // action 和 delete 是同级
        $delete_index = $('.action.delete');
        // console.log('delete_index',$delete_index);
        $delete_index.on("click",function(){
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
        $detail_task.on("click",function(){
            var $this = $(this);
            var index = $this.parent().parent().data('index');
            // console.log('index',index);
            // 设置content detail div的样式
            renderTaskDetailTpl(index);
            // 点击并且弹框
            $task_detail_mask.show();
            $task_detail_div.show();
        });


    }

    //delete task item
    function deleteTaskItem(index){
        console.log(task_list[index]);
        if( index === undefined || !task_list[index]) return ;
        delete task_list[index];
        store.set('task_list',task_list);
        renderTaskList();
        return true;
    }

})();