
;(function(){
    'use strict';
    // console.log('jquery',jQuery);
    var $addTaskForm = $('.add_task')
        ,$delete_index=null
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

    function renderTpl(data,index){
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

    function renderTaskList(){

        var $tasklist =  $('.tasklist');
        $tasklist.html('');
        for ( var x=0; x<task_list.length; x++){
            var $task_item = renderTpl(task_list[x],x);
            $tasklist.append($task_item);
        }
        // action 和 delete 是同级
        $delete_index = $('.action.delete');
        // console.log('delete_index',$delete_index);
        $delete_index.on("click",function(){
            var $this = $(this);
            var index = $this.parent().parent().data('index');
            deleteTaskItem(index);
        })

    }

    //delete task item
    function deleteTaskItem(index){
        if( !index || !task_list[index]) return ;
        delete task_list[index];
        renderTaskList();

    }

})();