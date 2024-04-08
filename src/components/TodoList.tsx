import React, {useEffect, useState} from "react";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import useDebounce from '../hooks/debounce';
import Priority from "./Priority.jsx";
import FilterCategory from "./FilterCategory.jsx";
import Pagination from "./Pagination.jsx";
import StatsPriority from "./StatsPriority.jsx";
import StatsCategory from "./StatsCategory.jsx";
import {Link} from "react-router-dom";


interface Task {
    id: number;
    title: string;
    priority: string;
    description: string;
    category: {
        id: number;
        title: string;
    };
    start_at: string;
    end_at: string;
}


const TodoList: React.FC = () => {
    const [data, setData] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [delState,setDelState] = useState(false);
    const [search,setSearch] = useState("");
    const debouncedSearch = useDebounce(search,500);
    const [priorityValue, setPriorityValue] = useState("");
    const [categoryValue, setCategoryValue] = useState("");
    const [pageValue,setPageValue] = useState(0);
    const [pageLen,setPageLen] = useState<number>();
    const getData = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setError("Token id not defined");
                return;
            }
            const res = await fetch(`http://localhost:8080/api/user/?title=${search}&priority=${priorityValue}&categoryId=${categoryValue}&page=${pageValue}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setError(`Server error: ${res.status}`);
                return;
            }

            const resData = await res.json();
            setData(resData.tasks);
            setPageLen(resData.total_pages);
        } catch (error) {
            console.log("Fetching Error ", error);
            setError("Fetching data failed.");
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id:number) => {
        try{
            const token = localStorage.getItem("accessToken");
            if(!token){
                console.log("!TOKEN")
            }
             await axios.delete(`http://localhost:8080/api/user/task/${id}`,{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            setDelState(!delState);
        }catch (e){
            console.log("Delete Error ", e)
        }
    }

    useEffect(() => {
        console.log("useEffect triggered");
        getData();
    }, [delState, debouncedSearch, priorityValue, categoryValue,pageValue]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };
    const handlePriority = (priority:string) => {
        setPriorityValue(priority);
    }
    const handleCategory = (category:string) => {
        setCategoryValue(category);
    }
    const handlePagination = (page:number) => {
        setPageValue(page);
        console.log("handle function", pageValue+1)
    }

    return (
        <div className="grid grid-cols-4 gap-3 mt-1">
            <div className="col-start-1 col-end-2">
                <StatsPriority />
                <StatsCategory />
            </div>
            <div className="col-start-2 col-span-2">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <div className="flex flex-wrap gap-2 text-center justify-center">
                        <h2 className="w-full font-bold">TODO</h2>
                        <form className="w-full mx-3">
                            <input
                                type="search"
                                id="default-search"
                                onChange={handleOnChange}
                                value={search}
                                className="block w-full p-4 ps-10 text-sm text-white border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-800 border-gray-600 placeholder-white"
                                placeholder="Search Tasks"
                                required
                            />
                            <button
                                type="submit"
                                className="text-white absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                            >
                                Search
                            </button>
                        </form>
                        {data.map((task) => (
                            <div key={task.id} className="p-3 bg-gray-800 rounded-lg text-white">
                                <div className="w-full flex gap-1 justify-center flex-wrap">
                                    <div
                                        className={`w-full rounded-lg text-white ${
                                            task.priority === "HIGH"
                                                ? "bg-red-800"
                                                : task.priority === "NORMAL"
                                                    ? "bg-yellow-600"
                                                    : "bg-green-600"
                                        }`}
                                    >
                                        {task.priority}
                                    </div>
                                    <div className="">{task.category.title}</div>
                                </div>
                                <div className="w-full flex gap-1 justify-center flex-wrap">
                                    <div className="w-full">{task.title}</div>
                                    <div className="w-full">{task.description}</div>
                                </div>
                                <div className="w-full flex gap-1 justify-center">
                                    <div className="">{task.end_at}</div>
                                    <div className="">{task.start_at}</div>
                                </div>
                                <div className="w-full flex gap-1 justify-between">
                                    <button
                                        className="mt-4 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        Delete
                                    </button>
                                    <Link to={`/home/${task.id}`}>
                                        <button className="mt-4 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
                                            Update
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        <div className="w-full">
                            <Pagination pageLength={pageLen} changePagination={handlePagination} />
                        </div>
                    </div>
                )}
            </div>
            <div className="col-start-4 col-end-5">
                <Priority changePriority={handlePriority} />
                <FilterCategory changeCategory={handleCategory} />
            </div>
        </div>
    );
};

export default TodoList;
