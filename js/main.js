
;(function(){
    'use strict';
    // console.log('jquery',jQuery);
    var $addTaskForm = $('.add_task')
        ,task_list = []
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

    function init(){
        task_list = store.get('task_list') || [];
        if(task_list.length>0){
            renderTaskList()
        }
    }

    function storeTaskList(new_task){
        task_list.push(new_task);
        store.set('task_list',task_list);
    }

    function renderTpl(data){
        var task_item_tpl =
            '<div class="taskitem">' +
            '<span><input type="checkbox" style="margin-right:10px;"></span>' +
            '<span class="task_content">'+data.content+'</span>' +
            '<span class="fr">'+
            '<span class="action">delete</span>' +
            '<span class="action">detail</span>' +
            '</span>'+
            '</div>';
        // console.log('temp_task_item',task_item_tpl);
        return $(task_item_tpl);

    }

    function renderTaskList(){

        var $tasklist =  $('.tasklist');
        $tasklist.html('');
        for ( var x=0; x<task_list.length; x++){
            var $task_item = renderTpl(task_list[x]);
            $tasklist.append($task_item);
        }
    }

})();