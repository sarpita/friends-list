import React, { useState, useRef, useCallback, useEffect } from 'react';
import './style.css';
import star from '../img/star.svg';
import starActive from '../img/star-active.svg';
import deleteIcon from '../img/delete.svg';
import ReactModal from 'react-modal';
import up from '../img/up.svg';
import down from '../img/down.svg';
import Pagination from '../pagination';

const ls = window.localStorage;

const List = () => {
    const savedList =JSON.parse(ls.getItem('friends'));
    const [friends, setFriends] = useState(savedList === null ? []:savedList);
    const [showModal, setShowModal] = useState(false);
    const [order, setOrder] = useState('fav-first');
    const nameInput = useRef(null);
    const searchInputRef =useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput,setSearchInput] = useState('');
    const [friendTodelete, setFriendToDelete] = useState('');
    const LIMIT = 4;

    const onPageChanged = useCallback(
        (event) => {
            event.preventDefault();
            setCurrentPage(parseInt(event.target.innerText));
        },
        [setCurrentPage]
    );
    const onNext = useCallback(
        () => {
            if (currentPage < friends.length / LIMIT) {
                setCurrentPage(currentPage + 1);
            }
        },
        [setCurrentPage, currentPage, friends]
    );
    const onPrev = useCallback(
        () => {
            if (currentPage !== 1) {
                setCurrentPage(currentPage - 1);
            }
        },
        [setCurrentPage, currentPage]
    );

    const setFriendsList = (friendList) => {
        setFriends(friendList);
        ls.setItem(
            'friends', JSON.stringify(friendList)
        );
    }
    const onSubmit = () => {
        if(friends.filter(friend=>{
            return friend.name === nameInput.current.value 
        }).length === 0){
            setFriendsList([{
                name: nameInput.current.value.trim(),
                isFav: false,
            },...friends]);
            nameInput.current.value = '';
        } 
    }
    const onFavClick = (e) => {
        const friendName = e.target.parentElement.parentElement.firstChild.firstChild.innerText;
        setFriendsList(friends.map((friend) => {
            if (friend.name === friendName) {
                return { ...friend, isFav: !friend.isFav }
            }
            return friend;
        }));
    }
    const ondeleteClick = (e) => {
        setShowModal(true);
        setFriendToDelete(e.target.parentElement.parentElement.firstChild.firstChild.innerText);
    }
    const deleteFriend = () => {
        const filteredList = friends.filter((friend) => {
            return friend.name !== friendTodelete;
        })
        setFriendsList(filteredList);
        setShowModal(false);
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setFriendToDelete('');
    }
    const onSearchInputChange =()=>{
        setSearchInput(searchInputRef.current.value);
    }
    const sortList = (e) => {
        const sortedFavList = friends.filter((friend) => {
            return friend.isFav === true;
        })
        const unsortedFavList = friends.filter((friend) => {
            return friend.isFav !== true;
        })
        if (order === 'fav-first') {
            const sortedListArray = [...sortedFavList, ...unsortedFavList];
            setFriends(sortedListArray);
            setOrder('fav-last');

        } else {
            const sortedListArray = [...unsortedFavList, ...sortedFavList];
            setFriends(sortedListArray);
            setOrder('fav-first');
        }

    }
    const searchFunc =(friends)=> friends.filter((friend)=>friend.name.includes(searchInput))

    useEffect(() => {
        nameInput.current.focus();
    },[nameInput])
    return (
        <div>
            <div className='container'>
                <div style={{background:'#ccc',fontWeight:'500'}}><label>Friends List</label></div>
                <form onSubmit={onSubmit}>
                    <input ref={nameInput} type="name" style={{width:'100%',padding:'0.5em',borderRadius:'3px'}} required pattern='^[a-zA-Z\s\.]*$' placeholder="Enter your friend's name"></input>
                </form>
                {friends.length >= 2 && <div className='sort_container'>
                    <div>
                        <input onChange={onSearchInputChange} ref={searchInputRef} type='text' placeholder='Search your friend here....'></input>
                    </div>
                    <div className='sortIcon'>
                       <span>Sort-</span>
                    {order === 'fav-first' ?
                            <img onClick={sortList} src={up} alt='sort' /> :
                            <img onClick={sortList} src={down} alt='sort' />}
                    </div>
                </div>}
                {
                    searchFunc(friends).slice(
                        (currentPage - 1) * LIMIT,
                        (currentPage - 1) * LIMIT + LIMIT
                    ).map((friend, index) => {
                        return (
                            <div className='friends-list' key={index}>
                                <div className='friend-name'><h4>{friend.name}</h4><p>is your friend</p></div>
                                <div onClick={onFavClick} className='favorite'>
                                    <img src={friend.isFav ? starActive : star} alt='star' />
                                </div>
                                <div onClick={ondeleteClick} className='delete-btn'>
                                    <img src={deleteIcon} alt='delete' />
                                </div>
                            </div>
                        )
                    })
                }
                {
                    searchFunc(friends).length > 4 &&
                    <Pagination
                        totalPages={Math.ceil(searchFunc(friends).length / LIMIT)}
                        pageLimit={LIMIT}
                        onPageChanged={onPageChanged}
                        currentPage={currentPage}
                        onNext={onNext}
                        onPrev={onPrev}
                    />
                }
            </div>
            <ReactModal
                isOpen={showModal}
                className="modal-popup"
                overlayClassName="overlay"
            >
                <p style={{paddingBottom:'2em'}}> Do you really want to delete your friend -
                   <span style={{ fontWeight: 'bold' }}>{friendTodelete}</span> ?
                   </p>
                <button className='pagination-button' style={{marginRight:'2em'}} onClick={deleteFriend}>Yes</button>
                <button style={{background:'#fff',border:'1px solid #2874f0',color:'#2874f0'}} className='pagination-button' onClick={handleCloseModal}>No</button>
            </ReactModal>
        </div>
    )
}

export default List;