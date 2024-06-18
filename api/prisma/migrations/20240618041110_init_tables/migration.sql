BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[factory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(100) NOT NULL,
    [created_at] DATETIME NOT NULL CONSTRAINT [DF__factory__created__3B75D760] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME NOT NULL CONSTRAINT [DF__factory__updated__3C69FB99] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [factory_pk] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__factory__72E12F1B59FCADD4] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[sprocket] (
    [id] INT NOT NULL IDENTITY(1,1),
    [teeth] INT NOT NULL,
    [pitch_diameter] INT NOT NULL,
    [outside_diameter] INT NOT NULL,
    [pitch] INT NOT NULL,
    CONSTRAINT [sprocket_pk] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sprocket_production] (
    [id] INT NOT NULL IDENTITY(1,1),
    [factory_id] INT NOT NULL,
    [sprocket_id] INT NOT NULL,
    [goal] INT NOT NULL,
    [actual] INT NOT NULL,
    [time] BIGINT NOT NULL,
    CONSTRAINT [NewTable_PK] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[sprocket_production] ADD CONSTRAINT [NewTable_factory_FK] FOREIGN KEY ([factory_id]) REFERENCES [dbo].[factory]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[sprocket_production] ADD CONSTRAINT [NewTable_sprocket_FK] FOREIGN KEY ([sprocket_id]) REFERENCES [dbo].[sprocket]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
