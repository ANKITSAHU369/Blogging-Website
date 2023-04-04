export const USER_TYPES = {
    ADMIN: 1,
    AUTHOR: 2,
    READER: 3
}

export const getUsers = () => {
    return [
        {
            userId: 1,
            userType: USER_TYPES.ADMIN,
            userName: "Admin",
            email: 'admin@mail.com',
            password: '123@admin'
        },
        {
            userId: 2,
            userType: USER_TYPES.AUTHOR,
            userName: "Author One",
            email: 'authorOne@mail.com',
            password: 'authorOne'
        },
        {
            userId: 3,
            userType: USER_TYPES.AUTHOR,
            userName: "Author Two",
            email: 'authorTwo@mail.com',
            password: 'authorTwo'
        },
        {
            userId: 4,
            userType: USER_TYPES.READER,
            userName: "Reader",
            email: 'reader@mail.com',
            password: 'reader'
        }
    ]
}