const message = (cate, msg) => {
    return (
        <div className={`alert container alert-${cate} fade show`} role="alert" style={{fontSize: '1.4rem', backgroundColor: `${cate === 'danger' ? '#F8D7DA60' : cate === 'primary' ? '#9EC5FE60' : '#A3CFBB60'}`}}>
            <strong>{msg}</strong>
        </div>
    );
};

export { message };
