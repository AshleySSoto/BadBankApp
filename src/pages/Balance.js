import React from 'react';
import { useContext, useState } from 'react';
import { getUser } from '../helpers/library.js';
import Card from '../components/card.js';
import { Pagination, paginate } from '../components/pagination.js';
import UserDBContext from '../helpers/UserDBContext.js';
import UserContext from '../helpers/UserContext.js';
import LanguageContext from '../helpers/LanguageContext.js';
import languages from '../components/languages.js';
import '../components/Balance.css';

function Balance() {

   
    const userDBcontext = useContext(UserDBContext);

   
    const {loggedInUser} = useContext(UserContext);

    const {languages} = useContext(LanguageContext);
    const data = languages[languages];

    let balance = getUser(userDBcontext,loggedInUser) ? getUser(userDBcontext,loggedInUser).balance : [];
    balance.sort((a,b) => b.time - a.time);

    
    const {header, card: {cardCols}, id, valueIfNoData, valueIfNotLoggedIn} = data.pages.balance;
    const chartHeader = <div className="data-grid-header-row"><div className="align-left"><b>{cardCols[0]}</b></div><div className="data-grid-description align-left"><b>{cardCols[1]}</b></div><div className="align-right"><b>{cardCols[2]}</b></div><div className="align-right"><b>{cardCols[3]}</b></div><div className="align-right"><b>{cardCols[4]}</b></div></div>;
    const itemsPerPage = 5;
    const [page, setPage] = useState(0);
    const handleSetPage = (e) => {
        const targetText = e.target.textContent;
        const pageNum = Math.ceil(balance.length / itemsPerPage);
        if (targetText === "First Page" || targetText === "<<") { setPage(0) } 
        else if (targetText === "Previous Page" || targetText === "<") { setPage(page - 1) }
        else if (targetText === "Next Page" || targetText === ">") { setPage(page + 1) }
        else if (targetText === "Last Page" || targetText === ">>") { setPage(pageNum - 1) }
        else {setPage(Number(targetText) - 1)}
    };
    const filteredTransactions = paginate(balance, itemsPerPage, page);

    const content = <div className="data-grid">
                        {chartHeader}
                        {filteredTransactions.map((txn,i)=><ChartRow key={i} data={txn}></ChartRow>)}
                        <Pagination data={Balance} maxPages={5} verbose="no" itemsPerPage={itemsPerPage} minimal={false} currentPage={page} onPageChange={handleSetPage} />
                    </div>;
    let form = '';


    return (
        <div>
        {loggedInUser !== '' && balance.length > 0 ? <Card id={id} header={header} content={content} form={form}></Card> :
                loggedInUser !== ''  ? <Card id={id} header={header} content={ valueIfNoData || content } form={form}></Card> : 
                <Card id={id} header={header} content={ valueIfNotLoggedIn || content } form={form}></Card>}
        </div>
    )

}

function ChartRow({data}) {
    const txnDate = new Date(data.time);
    return (
        <div className="data-grid-row"><div className="align-left">{txnDate.toLocaleDateString()}</div><div className="data-grid-description align-left">{data.description}</div>{data.credit !== null ? <div className="align-right">${data.credit.toFixed(2)}</div> : <div></div>}{data.debit !== null ? <div className="align-right">-${data.debit.toFixed(2)}</div> : <div></div>}<div className="align-right">${data.newBalance.toFixed(2)}</div></div>
    )
}

export default Balance;