import { FC, useState, useContext, useEffect } from 'react';
import Head from '@/components/head';
import Layout from '@/components/Layout';
import classNames from '@/styles/tasks.module.scss';
import task, { TABS, Tab } from '@/interfaces/task.type';
import Tabs from '@/components/Tabs';
import fetch from '@/helperFunctions/fetch';
import { toast, ToastTypes } from '@/helperFunctions/toast';
import {
    ASSIGNED,
    COMPLETED,
    AVAILABLE,
    IN_PROGRESS,
    SMOKE_TESTING,
    NEEDS_REVIEW,
    IN_REVIEW,
    APPROVED,
    MERGED,
    SANITY_CHECK,
    REGRESSION_CHECK,
    RELEASED,
    VERIFIED,
    BLOCKED,
} from '@/components/constants/task-status';
import {
    TASKS_FETCH_ERROR_MESSAGE,
    NO_TASKS_FOUND_MESSAGE,
} from '@/components/constants/messages';
import updateTasksStatus from '@/helperFunctions/updateTasksStatus';
import { useAppContext } from '@/context';
import { isUserAuthorizedContext } from '@/context/isUserAuthorized';
import { TasksProvider } from '@/context/tasks.context';
import TaskList from '@/components/tasks/TaskList/TaskList';
import { TASKS_URL } from '@/components/constants/url';
import useUpdateTask from '@/hooks/useUpdateTask';
import groupTasksByStatus from '@/utils/groupTasksByStatus';
import { useGetAllTasksQuery } from '@/app/services/tasksApi';
import useFetch from '@/hooks/useFetch';

const { SUCCESS, ERROR } = ToastTypes;
const STATUS_ORDER = [
    ASSIGNED,
    COMPLETED,
    BLOCKED,
    AVAILABLE,
    IN_PROGRESS,
    SMOKE_TESTING,
    NEEDS_REVIEW,
    IN_REVIEW,
    APPROVED,
    MERGED,
    SANITY_CHECK,
    REGRESSION_CHECK,
    RELEASED,
    VERIFIED,
];

const statusActiveList = [IN_PROGRESS, BLOCKED, SMOKE_TESTING];
async function updateCardContent(id: string, cardDetails: task) {
    try {
        const { requestPromise } = fetch({
            url: `${TASKS_URL}/${id}`,
            method: 'patch',
            data: cardDetails,
        });
        await requestPromise;
        toast(SUCCESS, 'Changes have been saved !');
    } catch (err: any) {
        if ('response' in err) {
            toast(ERROR, err.response.data.message);
            return;
        }
        toast(ERROR, err.message);
    }
}

const Index: FC = () => {
    const { state: appState } = useAppContext();
    // TODO: the below code should be used when mutation for updating tasks is implemented
    // const { data: tasks = [], isError, isLoading } = useGetAllTasksQuery();
    const { isEditMode } = appState;
    const isUserAuthorized = useContext(isUserAuthorizedContext);
    const isEditable = isUserAuthorized && isEditMode;
    const [activeTab, setActiveTab] = useState(Tab.ASSIGNED);
    // TODO: the below code should removed when mutation for updating tasks is implemented
    const [filteredTask, setFilteredTask] = useState<any>([]);
    // TODO: the below code should removed when mutation for updating tasks is implemented
    const { response, isLoading: loading, error } = useFetch(TASKS_URL);
    // TODO: the below code should removed when mutation for updating tasks is implemented
    const updateTask = useUpdateTask(filteredTask, setFilteredTask);

    const onSelect = (tab: Tab) => {
        setActiveTab(tab);
    };

    // TODO: the useEffect should be removed when mutation for updating tasks is implemented
    useEffect(() => {
        if ('tasks' in response) {
            const tasks = updateTasksStatus(response.tasks);
            tasks.sort((a: task, b: task) => +a.endsOn - +b.endsOn);
            tasks.sort(
                (a: task, b: task) =>
                    STATUS_ORDER.indexOf(a.status) -
                    STATUS_ORDER.indexOf(b.status)
            );
            const taskMap: any = groupTasksByStatus(tasks);
            setFilteredTask(taskMap);
        }
        return () => {
            setFilteredTask([]);
        };
    }, [loading, response]);

    // TODO: the below code should be used when mutation for updating tasks is implemented
    // const tasksGroupedByStatus = updateTasksStatus(tasks).reduce(
    //     (acc: Record<string, task[]>, curr: task) => {
    //         return acc[curr.status as keyof task]
    //             ? {
    //                   ...acc,
    //                   [curr.status]: [...acc[curr.status as keyof task], curr],
    //               }
    //             : { ...acc, [curr.status]: [curr] };
    //     },
    //     {}
    // );

    const renderTabSection = () => (
        <div className={classNames.tabsContainer}>
            <Tabs
                tabs={TABS as Tab[]}
                onSelect={onSelect}
                activeTab={activeTab}
            />
        </div>
    );

    const renderTaskList = () => (
        <div>
            {filteredTask[activeTab] ? (
                <TaskList
                    tasks={filteredTask[activeTab]}
                    isEditable={isEditable}
                    updateCardContent={updateCardContent}
                    updateTask={updateTask}
                />
            ) : (
                <p>{NO_TASKS_FOUND_MESSAGE}</p>
            )}
        </div>
    );

    return (
        <Layout>
            <Head title="Tasks" />
            <TasksProvider>
                <div className={classNames.container}>
                    {error && <p>{TASKS_FETCH_ERROR_MESSAGE}</p>}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {Object.keys(filteredTask).length > 0 ? (
                                <div className={classNames.tasksContainer}>
                                    {renderTabSection()}
                                    {renderTaskList()}
                                </div>
                            ) : (
                                !error && <p>{NO_TASKS_FOUND_MESSAGE}</p>
                            )}
                        </>
                    )}
                </div>
            </TasksProvider>
        </Layout>
    );
};

export default Index;
